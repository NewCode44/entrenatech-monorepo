// Portal Cautivo WiFi - Sistema de autenticación para acceso a Internet y EntrenaTech
// Integración con MikroTik RouterOS + Firebase Authentication

export interface WiFiConfig {
  routerIP: string;
  routerUser: string;
  routerPassword: string;
  networkName: string;
  hotspotName: string;
  redirectURL: string;
  sessionTimeout: number; // minutos
  downloadLimit: number; // Mbps
  uploadLimit: number; // Mbps
}

export interface CaptivePortalSession {
  id: string;
  userId: string;
  gymId: string;
  macAddress: string;
  ipAddress: string;
  startTime: number;
  endTime: number;
  dataUsed: {
    download: number; // MB
    upload: number; // MB
  };
  status: 'active' | 'expired' | 'disconnected';
}

export interface GymMember {
  id: string;
  name: string;
  email: string;
  membershipType: 'basic' | 'premium' | 'vip';
  membershipActive: boolean;
  membershipExpiry: string;
  dataAllowance: {
    daily: number; // GB
    monthly: number; // GB
  };
  speedLimits: {
    basic: { download: number; upload: number };
    premium: { download: number; upload: number };
    vip: { download: number; upload: number };
  };
}

export class CaptivePortalService {
  private static instance: CaptivePortalService;
  private activeSessions: Map<string, CaptivePortalSession> = new Map();
  private routerConfig: WiFiConfig;

  constructor(config: WiFiConfig) {
    this.routerConfig = config;
    this.initializeMonitoring();
  }

  /**
   * Inicia el portal cautivo - primera página que ve el usuario
   */
  async startCaptivePortal(request: {
    macAddress: string;
    ipAddress: string;
    userAgent: string;
    redirectUrl?: string;
  }): Promise<{
    loginPage: string;
    sessionId: string;
    gymInfo: {
      name: string;
      logo: string;
      welcomeMessage: string;
    };
  }> {
    const sessionId = this.generateSessionId();

    // Registrar la solicitud en el sistema
    const session: CaptivePortalSession = {
      id: sessionId,
      userId: '',
      gymId: this.extractGymId(request.ipAddress),
      macAddress: request.macAddress,
      ipAddress: request.ipAddress,
      startTime: Date.now(),
      endTime: Date.now() + (5 * 60 * 1000), // 5 minutos para login
      dataUsed: { download: 0, upload: 0 },
      status: 'active'
    };

    this.activeSessions.set(sessionId, session);

    // Obtener información del gym actual
    const gymInfo = await this.getGymInfo(session.gymId);

    return {
      loginPage: this.generateLoginPage(sessionId, gymInfo, request.redirectUrl),
      sessionId,
      gymInfo
    };
  }

  /**
   * Autentica al usuario y activa Internet
   */
  async authenticateUser(request: {
    sessionId: string;
    email: string;
    password: string;
    gymCode?: string;
  }): Promise<{
    success: boolean;
    redirectUrl?: string;
    error?: string;
    memberInfo?: GymMember;
    sessionInfo?: CaptivePortalSession;
  }> {
    try {
      // 1. Validar credenciales del usuario
      const memberInfo = await this.authenticateGymMember(request.email, request.password, request.gymCode);

      if (!memberInfo) {
        return { success: false, error: 'Credenciales inválidas o membresía inactiva' };
      }

      // 2. Obtener sesión actual
      const session = this.activeSessions.get(request.sessionId);
      if (!session) {
        return { success: false, error: 'Sesión expirada, por favor intenta nuevamente' };
      }

      // 3. Configurar acceso en MikroTik RouterOS
      const routerResponse = await this.configureRouterAccess({
        macAddress: session.macAddress,
        ipAddress: session.ipAddress,
        memberInfo
      });

      if (!routerResponse.success) {
        return { success: false, error: 'Error configurando acceso a Internet' };
      }

      // 4. Actualizar sesión con acceso completo
      const accessDuration = this.getAccessDuration(memberInfo.membershipType);
      const updatedSession: CaptivePortalSession = {
        ...session,
        userId: memberInfo.id,
        endTime: Date.now() + (accessDuration * 60 * 1000),
        status: 'active'
      };

      this.activeSessions.set(request.sessionId, updatedSession);

      // 5. Registrar uso para facturación
      await this.recordUsage({
        gymId: session.gymId,
        memberId: memberInfo.id,
        accessType: memberInfo.membershipType,
        duration: accessDuration
      });

      return {
        success: true,
        redirectUrl: this.routerConfig.redirectURL,
        memberInfo,
        sessionInfo: updatedSession
      };

    } catch (error) {
      console.error('Error en autenticación:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  /**
   * Verificación del estado de la sesión
   */
  async checkSession(sessionId: string): Promise<{
    valid: boolean;
    session?: CaptivePortalSession;
    timeRemaining?: number; // minutos restantes
    dataUsage?: { download: number; upload: number };
  }> {
    const session = this.activeSessions.get(sessionId);

    if (!session || session.status !== 'active') {
      return { valid: false };
    }

    if (Date.now() > session.endTime) {
      // Sesión expirada - revocar acceso en router
      await this.revokeRouterAccess(session.macAddress);
      session.status = 'expired';
      return { valid: false };
    }

    // Actualizar uso de datos desde el router
    const currentUsage = await this.getDataUsage(session.macAddress);
    session.dataUsed = currentUsage;

    const timeRemaining = Math.floor((session.endTime - Date.now()) / (60 * 1000));

    return {
      valid: true,
      session,
      timeRemaining,
      dataUsage: currentUsage
    };
  }

  /**
   * Logout manual del usuario
   */
  async logout(sessionId: string): Promise<{ success: boolean }> {
    const session = this.activeSessions.get(sessionId);

    if (session) {
      // Revocar acceso en router
      await this.revokeRouterAccess(session.macAddress);

      // Marcar sesión como desconectada
      session.status = 'disconnected';

      // Limpiar sesión
      this.activeSessions.delete(sessionId);

      return { success: true };
    }

    return { success: false };
  }

  /**
   * Genera la página HTML del portal de login
   */
  private generateLoginPage(
    sessionId: string,
    gymInfo: any,
    redirectUrl?: string
  ): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal WiFi - ${gymInfo.name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 1rem;
            border-radius: 12px;
        }
        h1 { color: #333; margin-bottom: 0.5rem; }
        .subtitle { color: #666; margin-bottom: 2rem; }
        .form-group { margin-bottom: 1rem; text-align: left; }
        label { display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500; }
        input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        input:focus { outline: none; border-color: #667eea; }
        .btn {
            width: 100%;
            padding: 0.875rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .btn:hover { transform: translateY(-1px); }
        .btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .error {
            background: #fee;
            color: #c33;
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            display: none;
        }
        .loading { display: none; }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .footer {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #e1e5e9;
            color: #666;
            font-size: 0.875rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="${gymInfo.logo}" alt="${gymInfo.name}" class="logo">
        <h1>¡Bienvenido a ${gymInfo.name}!</h1>
        <p class="subtitle">${gymInfo.welcomeMessage}</p>

        <div class="error" id="error"></div>

        <form id="loginForm">
            <input type="hidden" name="sessionId" value="${sessionId}">
            <input type="hidden" name="redirectUrl" value="${redirectUrl || '/dashboard'}">

            <div class="form-group">
                <label for="email">Email del Miembro</label>
                <input type="email" id="email" name="email" required autocomplete="email">
            </div>

            <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" required>
            </div>

            <div class="form-group">
                <label for="gymCode">Código del Gym (opcional)</label>
                <input type="text" id="gymCode" name="gymCode" placeholder="Si aplica">
            </div>

            <button type="submit" class="btn" id="loginBtn">
                Conectar y Navegar
            </button>

            <div class="loading" id="loading">
                <div class="spinner"></div>
                <p>Conectando...</p>
            </div>
        </form>

        <div class="footer">
            <p>Al conectarte aceptas nuestros términos de servicio</p>
            <p>¿Necesitas ayuda? Contacta al staff del gym</p>
        </div>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const form = e.target;
            const formData = new FormData(form);
            const errorDiv = document.getElementById('error');
            const loginBtn = document.getElementById('loginBtn');
            const loading = document.getElementById('loading');

            // Mostrar loading
            loginBtn.style.display = 'none';
            loading.style.display = 'block';
            errorDiv.style.display = 'none';

            try {
                const response = await fetch('/api/wifi/authenticate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sessionId: formData.get('sessionId'),
                        email: formData.get('email'),
                        password: formData.get('password'),
                        gymCode: formData.get('gymCode')
                    })
                });

                const result = await response.json();

                if (result.success) {
                    // Redirigir a la URL solicitada o al dashboard
                    window.location.href = result.redirectUrl;
                } else {
                    errorDiv.textContent = result.error;
                    errorDiv.style.display = 'block';
                    loginBtn.style.display = 'block';
                    loading.style.display = 'none';
                }
            } catch (error) {
                errorDiv.textContent = 'Error de conexión. Intenta nuevamente.';
                errorDiv.style.display = 'block';
                loginBtn.style.display = 'block';
                loading.style.display = 'none';
            }
        });
    </script>
</body>
</html>`;
  }

  // === MÉTODOS PRIVADOS ===

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private extractGymId(ipAddress: string): string {
    // Lógica para determinar el gym basado en la IP (configuración DHCP)
    return 'default_gym';
  }

  private async getGymInfo(gymId: string): Promise<any> {
    // Obtener información del gym desde Firestore
    return {
      name: 'EntrenaTech Demo',
      logo: '/logo.png',
      welcomeMessage: 'Conecta y comienza tu entrenamiento'
    };
  }

  private async authenticateGymMember(
    email: string,
    password: string,
    gymCode?: string
  ): Promise<GymMember | null> {
    try {
      // Importar Firebase Auth
      const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
      const auth = getAuth();

      // Autenticar con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Obtener información adicional del miembro desde Firestore
      const memberDoc = await this.getMemberFromFirestore(userCredential.user.uid);

      return memberDoc;
    } catch (error) {
      console.error('Error autenticando miembro:', error);
      return null;
    }
  }

  private async getMemberFromFirestore(memberId: string): Promise<GymMember | null> {
    // Obtener datos del miembro desde Firestore
    // Mock por ahora
    return {
      id: memberId,
      name: 'Miembro Demo',
      email: 'demo@entrenatech.com',
      membershipType: 'premium',
      membershipActive: true,
      membershipExpiry: '2024-12-31',
      dataAllowance: {
        daily: 5, // 5GB diarios
        monthly: 50 // 50GB mensuales
      },
      speedLimits: {
        basic: { download: 5, upload: 2 },
        premium: { download: 20, upload: 10 },
        vip: { download: 100, upload: 50 }
      }
    };
  }

  private async configureRouterAccess(config: {
    macAddress: string;
    ipAddress: string;
    memberInfo: GymMember;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      // Conectar a MikroTik RouterOS via API
      const routerResponse = await this.mikrotikAPI({
        action: '/ip/hotspot/active/add',
        params: {
          'mac-address': config.macAddress,
          address: config.ipAddress,
          comment: `EntrenaTech-${config.memberInfo.membershipType}`,
          timeout: this.getAccessDuration(config.memberInfo.membershipType) * 60
        }
      });

      // Configurar límites de velocidad
      const speedLimit = config.memberInfo.speedLimits[config.memberInfo.membershipType];
      await this.mikrotikAPI({
        action: '/queue/simple/add',
        params: {
          name: `EntrenaTech-${config.macAddress}`,
          target: config.ipAddress,
          'max-limit': `${speedLimit.download}M/${speedLimit.upload}M`,
          comment: `EntrenaTech-${config.memberInfo.membershipType}`
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error configurando router:', error);
      return { success: false, error: error.message };
    }
  }

  private async revokeRouterAccess(macAddress: string): Promise<void> {
    try {
      // Eliminar de hotspot active
      await this.mikrotikAPI({
        action: '/ip/hotspot/active/remove',
        params: { '.id': await this.findHotspotId(macAddress) }
      });

      // Eliminar cola de tráfico
      await this.mikrotikAPI({
        action: '/queue/simple/remove',
        params: { '.id': await this.findQueueId(macAddress) }
      });
    } catch (error) {
      console.error('Error revocando acceso:', error);
    }
  }

  private async mikrotikAPI(request: {
    action: string;
    params: Record<string, any>;
  }): Promise<any> {
    // Implementar conexión a MikroTik API
    // Esto requiere implementar el protocolo MikroTik API
    const url = `http://${this.routerConfig.routerIP}/rest`;

    const response = await fetch(url + request.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${this.routerConfig.routerUser}:${this.routerConfig.routerPassword}`)
      },
      body: JSON.stringify(request.params)
    });

    return response.json();
  }

  private async findHotspotId(macAddress: string): Promise<string> {
    // Buscar hotspot activo por MAC
    const response = await this.mikrotikAPI({
      action: '/ip/hotspot/active/print',
      params: { 'mac-address': macAddress }
    });
    return response[0]?.['.id'] || '';
  }

  private async findQueueId(macAddress: string): Promise<string> {
    // Buscar cola por comentario con MAC
    const response = await this.mikrotikAPI({
      action: '/queue/simple/print',
      params: { comment: `*${macAddress}*` }
    });
    return response[0]?.['.id'] || '';
  }

  private getAccessDuration(membershipType: string): number {
    // Duración en minutos según tipo de membresía
    const durations = {
      basic: 120,      // 2 horas
      premium: 480,    // 8 horas
      vip: 1440       // 24 horas
    };
    return durations[membershipType] || 120;
  }

  private async getDataUsage(macAddress: string): Promise<{ download: number; upload: number }> {
    try {
      // Obtener estadísticas de uso del router
      const response = await this.mikrotikAPI({
        action: '/ip/hotspot/active/print',
        params: { 'mac-address': macAddress }
      });

      if (response.length > 0) {
        const stats = response[0];
        return {
          download: Math.round((stats['bytes-in'] || 0) / 1024 / 1024), // MB
          upload: Math.round((stats['bytes-out'] || 0) / 1024 / 1024)    // MB
        };
      }

      return { download: 0, upload: 0 };
    } catch (error) {
      console.error('Error obteniendo uso de datos:', error);
      return { download: 0, upload: 0 };
    }
  }

  private async recordUsage(record: {
    gymId: string;
    memberId: string;
    accessType: string;
    duration: number;
  }): Promise<void> {
    // Registrar en Firestore para facturación y análisis
    console.log('Registrando uso:', record);
  }

  private initializeMonitoring(): void {
    // Monitorear sesiones activas cada 5 minutos
    setInterval(async () => {
      for (const [sessionId, session] of this.activeSessions) {
        if (Date.now() > session.endTime && session.status === 'active') {
          await this.revokeRouterAccess(session.macAddress);
          session.status = 'expired';
        }
      }
    }, 5 * 60 * 1000); // 5 minutos
  }

  static getInstance(config: WiFiConfig): CaptivePortalService {
    if (!CaptivePortalService.instance) {
      CaptivePortalService.instance = new CaptivePortalService(config);
    }
    return CaptivePortalService.instance;
  }
}

export const captivePortal = CaptivePortalService;