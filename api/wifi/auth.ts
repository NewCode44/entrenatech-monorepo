// API Endpoint para autenticación WiFi - Firebase Cloud Functions
import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'express';
import { CaptivePortalService, WiFiConfig } from '../../libs/wifi/captive-portal';

// Configuración del router (debe estar en variables de entorno)
const wifiConfig: WiFiConfig = {
  routerIP: process.env.MIKROTIK_IP || '192.168.88.1',
  routerUser: process.env.MIKROTIK_USER || 'admin',
  routerPassword: process.env.MIKROTIK_PASSWORD || '',
  networkName: process.env.NETWORK_NAME || 'EntrenaTech-WiFi',
  hotspotName: process.env.HOTSPOT_NAME || 'EntrenaTech-Hotspot',
  redirectURL: process.env.REDIRECT_URL || 'https://entrenatech.app/dashboard',
  sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '480'), // 8 horas
  downloadLimit: parseInt(process.env.DOWNLOAD_LIMIT || '20'), // 20 Mbps
  uploadLimit: parseInt(process.env.UPLOAD_LIMIT || '10') // 10 Mbps
};

const captivePortalService = CaptivePortalService.getInstance(wifiConfig);

/**
 * Iniciar sesión de portal cautivo
 * GET /api/wifi/start?mac=xx:xx:xx&ip=xx.xx.xx.xx
 */
export const startCaptivePortal = onRequest(
  {
    cors: true,
    region: 'us-central1'
  },
  async (req: Request, res: Response) => {
    try {
      const { mac, ip, userAgent, redirectUrl } = req.query;

      if (!mac || !ip) {
        return res.status(400).json({
          error: 'Se requieren parámetros MAC e IP',
          code: 'MISSING_PARAMS'
        });
      }

      const result = await captivePortalService.startCaptivePortal({
        macAddress: mac as string,
        ipAddress: ip as string,
        userAgent: userAgent as string || req.get('User-Agent'),
        redirectUrl: redirectUrl as string
      });

      // Enviar HTML del portal de login
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(result.loginPage);

    } catch (error) {
      console.error('Error iniciando portal cautivo:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * Autenticar usuario
 * POST /api/wifi/authenticate
 */
export const authenticateUser = onRequest(
  {
    cors: true,
    region: 'us-central1'
  },
  async (req: Request, res: Response) => {
    try {
      const { sessionId, email, password, gymCode } = req.body;

      if (!sessionId || !email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Faltan datos requeridos',
          code: 'MISSING_CREDENTIALS'
        });
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Email inválido',
          code: 'INVALID_EMAIL'
        });
      }

      const result = await captivePortalService.authenticateUser({
        sessionId,
        email,
        password,
        gymCode
      });

      if (result.success) {
        // Establecer cookie de sesión
        res.cookie('wifi_session', sessionId, {
          maxAge: result.sessionInfo.endTime - Date.now(),
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });

        return res.json({
          success: true,
          redirectUrl: result.redirectUrl,
          memberInfo: {
            name: result.memberInfo?.name,
            membershipType: result.memberInfo?.membershipType,
            sessionDuration: Math.floor((result.sessionInfo.endTime - Date.now()) / (60 * 1000))
          }
        });
      } else {
        return res.status(401).json({
          success: false,
          error: result.error,
          code: 'AUTH_FAILED'
        });
      }

    } catch (error) {
      console.error('Error en autenticación:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * Verificar estado de sesión
 * GET /api/wifi/status
 */
export const checkSession = onRequest(
  {
    cors: true,
    region: 'us-central1'
  },
  async (req: Request, res: Response) => {
    try {
      const sessionId = req.cookies.wifi_session || req.query.session as string;

      if (!sessionId) {
        return res.status(401).json({
          valid: false,
          error: 'No hay sesión activa',
          code: 'NO_SESSION'
        });
      }

      const result = await captivePortalService.checkSession(sessionId);

      if (result.valid) {
        return res.json({
          valid: true,
          session: {
            timeRemaining: result.timeRemaining,
            dataUsage: result.dataUsage
          }
        });
      } else {
        // Limpiar cookie inválida
        res.clearCookie('wifi_session');
        return res.status(401).json({
          valid: false,
          error: 'Sesión expirada o inválida',
          code: 'SESSION_EXPIRED'
        });
      }

    } catch (error) {
      console.error('Error verificando sesión:', error);
      res.status(500).json({
        valid: false,
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * Cerrar sesión (logout)
 * POST /api/wifi/logout
 */
export const logout = onRequest(
  {
    cors: true,
    region: 'us-central1'
  },
  async (req: Request, res: Response) => {
    try {
      const sessionId = req.cookies.wifi_session || req.body.session;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          error: 'No hay sesión para cerrar'
        });
      }

      const result = await captivePortalService.logout(sessionId);

      // Limpiar cookie
      res.clearCookie('wifi_session');

      return res.json({
        success: result.success,
        message: result.success ? 'Sesión cerrada correctamente' : 'Error cerrando sesión'
      });

    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
);

/**
 * API para configuración del router (solo administradores)
 * POST /api/wifi/config
 */
export const updateRouterConfig = onRequest(
  {
    cors: true,
    region: 'us-central1'
  },
  async (req: Request, res: Response) => {
    try {
      // Verificar autenticación de administrador
      const authToken = req.headers.authorization?.replace('Bearer ', '');
      if (!authToken) {
        return res.status(401).json({
          success: false,
          error: 'No autorizado'
        });
      }

      const adminUser = await verifyAdminToken(authToken);
      if (!adminUser) {
        return res.status(403).json({
          success: false,
          error: 'Acceso denegado - se requieren privilegios de administrador'
        });
      }

      const { gymId, config } = req.body;

      if (!gymId || !config) {
        return res.status(400).json({
          success: false,
          error: 'Faltan parámetros requeridos'
        });
      }

      // Actualizar configuración en Firestore
      await updateGymWiFiConfig(gymId, config);

      return res.json({
        success: true,
        message: 'Configuración actualizada correctamente'
      });

    } catch (error) {
      console.error('Error actualizando configuración:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
);

/**
 * Obtener estadísticas de uso WiFi
 * GET /api/wifi/stats
 */
export const getWiFiStats = onRequest(
  {
    cors: true,
    region: 'us-central1'
  },
  async (req: Request, res: Response) => {
    try {
      // Verificar autenticación de administrador
      const authToken = req.headers.authorization?.replace('Bearer ', '');
      if (!authToken) {
        return res.status(401).json({
          success: false,
          error: 'No autorizado'
        });
      }

      const adminUser = await verifyAdminToken(authToken);
      if (!adminUser) {
        return res.status(403).json({
          success: false,
          error: 'Acceso denegado'
        });
      }

      const { gymId, period } = req.query;

      // Obtener estadísticas de Firestore
      const stats = await getWiFiUsageStats(gymId as string, period as string);

      return res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
);

// === Funciones auxiliares ===

async function verifyAdminToken(token: string): Promise<any> {
  try {
    const { getAuth } = await import('firebase/auth');
    const auth = getAuth();

    const decodedToken = await auth.verifyIdToken(token);

    // Verificar si es administrador
    const userDoc = await getFirestore().collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();

    return userData?.role === 'admin' ? userData : null;
  } catch (error) {
    console.error('Error verificando token de admin:', error);
    return null;
  }
}

async function updateGymWiFiConfig(gymId: string, config: any): Promise<void> {
  const { getFirestore } = await import('firebase/firestore');
  const db = getFirestore();

  await db.collection('gyms').doc(gymId).update({
    'wifiConfig': config,
    'updatedAt': new Date()
  });
}

async function getWiFiUsageStats(gymId: string, period: string = '7d'): Promise<any> {
  const { getFirestore } = await import('firebase/firestore');
  const db = getFirestore();

  // Calcular fechas según período
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case '1d':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  // Obtener datos de uso
  const usageSnapshot = await db
    .collection('wifiUsage')
    .where('gymId', '==', gymId)
    .where('timestamp', '>=', startDate)
    .where('timestamp', '<=', now)
    .orderBy('timestamp', 'desc')
    .get();

  const usageData = usageSnapshot.docs.map(doc => doc.data());

  // Calcular estadísticas
  const totalSessions = usageData.length;
  const totalDataUsed = usageData.reduce((sum, session) =>
    sum + (session.dataDownload || 0) + (session.dataUpload || 0), 0
  );

  const uniqueUsers = new Set(usageData.map(session => session.memberId)).size;
  const avgSessionDuration = totalSessions > 0
    ? usageData.reduce((sum, session) => sum + (session.duration || 0), 0) / totalSessions
    : 0;

  return {
    period,
    totalSessions,
    totalDataUsed: Math.round(totalDataUsed), // MB
    uniqueUsers,
    avgSessionDuration: Math.round(avgSessionDuration), // minutos
    sessionsByMembershipType: usageData.reduce((acc, session) => {
      const type = session.membershipType || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    dataByDay: usageData.reduce((acc, session) => {
      const day = session.timestamp.toDate().toISOString().split('T')[0];
      if (!acc[day]) acc[day] = { sessions: 0, data: 0 };
      acc[day].sessions += 1;
      acc[day].data += (session.dataDownload || 0) + (session.dataUpload || 0);
      return acc;
    }, {} as Record<string, { sessions: number; data: number }>)
  };
}