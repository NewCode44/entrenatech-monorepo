"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.wifiStatus = exports.wifiAuth = exports.wifiPortal = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
// Inicializar Firebase Admin
admin.initializeApp();
const corsHandler = cors({ origin: true });
/**
 * Función principal del portal WiFi - genera página de login personalizada
 */
exports.wifiPortal = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const { mac, ip, redirectUrl, gym } = req.query;
            if (!mac || !ip) {
                res.status(400).json({
                    error: 'Se requieren parámetros MAC e IP',
                    code: 'MISSING_PARAMS'
                });
                return;
            }
            // Obtener branding del gym
            const branding = await getGymBranding(gym);
            // Generar HTML del portal cautivo
            const portalHTML = generateCaptivePortalHTML({
                mac: mac,
                ip: ip,
                branding,
                redirectUrl: redirectUrl,
                gymId: gym
            });
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.status(200).send(portalHTML);
        }
        catch (error) {
            console.error('Error en portal WiFi:', error);
            res.status(500).json({
                error: 'Error interno del servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    });
});
/**
 * Autenticación de usuarios del portal WiFi
 */
exports.wifiAuth = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const { sessionId, email, password, gymCode } = req.body;
            if (!sessionId || !email || !password) {
                res.status(400).json({
                    success: false,
                    error: 'Faltan datos requeridos',
                    code: 'MISSING_CREDENTIALS'
                });
                return;
            }
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                res.status(400).json({
                    success: false,
                    error: 'Email inválido',
                    code: 'INVALID_EMAIL'
                });
                return;
            }
            // Autenticar con Firebase
            let userRecord;
            try {
                userRecord = await admin.auth().getUserByEmail(email);
                // En producción, verificar contraseña con signInWithEmailAndPassword
                // Por ahora, simula autenticación exitosa
            }
            catch (error) {
                res.status(401).json({
                    success: false,
                    error: 'Usuario no encontrado',
                    code: 'USER_NOT_FOUND'
                });
                return;
            }
            // Obtener información del miembro
            const memberInfo = await getMemberInfo(userRecord.uid, gymCode);
            if (!memberInfo || !memberInfo.membershipActive) {
                res.status(401).json({
                    success: false,
                    error: 'Membresía inactiva o no encontrada',
                    code: 'INACTIVE_MEMBERSHIP'
                });
                return;
            }
            // Generar token de sesión WiFi
            const wifiToken = await generateWiFiWiFiToken(userRecord.uid, memberInfo.gymId);
            // Registrar acceso para facturación
            await recordWiFiAccess({
                gymId: memberInfo.gymId,
                memberId: userRecord.uid,
                membershipType: memberInfo.membershipType,
                sessionId,
                ipAddress: req.ip || 'unknown',
                userAgent: req.get('User-Agent') || 'unknown'
            });
            return res.json({
                success: true,
                redirectUrl: `/?gym=${memberInfo.gymId}`,
                wifiToken,
                memberInfo: {
                    name: memberInfo.name,
                    membershipType: memberInfo.membershipType,
                    sessionDuration: getSessionDuration(memberInfo.membershipType)
                }
            });
        }
        catch (error) {
            console.error('Error en autenticación WiFi:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    });
});
/**
 * Verificar estado de sesión WiFi
 */
exports.wifiStatus = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
            if (!token) {
                res.status(401).json({
                    valid: false,
                    error: 'No hay token de sesión',
                    code: 'NO_TOKEN'
                });
                return;
            }
            // Verificar token de sesión WiFi
            const sessionInfo = await verifyWiFiToken(token);
            if (!sessionInfo) {
                res.status(401).json({
                    valid: false,
                    error: 'Sesión inválida o expirada',
                    code: 'INVALID_TOKEN'
                });
                return;
            }
            // Obtener estadísticas de uso
            const usageStats = await getWiFiUsageStats(sessionInfo.sessionId);
            return res.json({
                valid: true,
                session: {
                    timeRemaining: sessionInfo.timeRemaining,
                    dataUsage: usageStats,
                    memberInfo: sessionInfo.memberInfo
                }
            });
        }
        catch (error) {
            console.error('Error verificando estado WiFi:', error);
            res.status(500).json({
                valid: false,
                error: 'Error interno del servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    });
});
/**
 * API general para otras funcionalidades
 */
exports.api = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const { path } = req;
        // Routing para diferentes endpoints de API
        if (path.startsWith('/health')) {
            return res.json({
                status: 'ok',
                service: 'entrenatech-api',
                version: '1.0.0',
                timestamp: new Date().toISOString(),
                features: {
                    wifi_portal: true,
                    white_label: true,
                    ai_hybrid: true,
                    captive_portal: true
                }
            });
        }
        if (path.startsWith('/branding/')) {
            const gymId = path.split('/')[2];
            const branding = await getGymBranding(gymId);
            return res.json({ branding });
        }
        res.status(404).json({
            error: 'Endpoint not found',
            available: ['/health', '/branding/:gymId']
        });
    });
});
async function getGymBranding(gymId) {
    const defaultBranding = {
        id: 'entrenatech-default',
        gymId: 'entrenatech',
        gymName: 'EntrenaTech',
        logoUrl: 'https://entrenapp-2025.web.app/logo.png',
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        welcomeMessage: '¡Bienvenido a EntrenaTech! Conecta y entrena',
        wifiWelcomeMessage: '¡Conecta y comienza tu entrenamiento!'
    };
    if (!gymId)
        return defaultBranding;
    try {
        const doc = await admin.firestore().collection('gymBranding').doc(gymId).get();
        if (doc.exists) {
            return doc.data();
        }
    }
    catch (error) {
        console.error('Error obteniendo branding:', error);
    }
    return defaultBranding;
}
async function getMemberInfo(uid, gymCode) {
    try {
        const doc = await admin.firestore().collection('members').doc(uid).get();
        if (doc.exists) {
            const memberData = doc.data();
            // Verificar si el miembro pertenece al gym solicitado
            if (gymCode && memberData.gymId !== gymCode) {
                return null;
            }
            // Verificar si la membresía está activa
            if (memberData.membershipExpiry < new Date()) {
                return null;
            }
            return memberData;
        }
    }
    catch (error) {
        console.error('Error obteniendo info del miembro:', error);
    }
    return null;
}
function generateCaptivePortalHTML(options) {
    const { mac, ip, branding, redirectUrl, gymId } = options;
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal WiFi - ${branding.gymName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.secondaryColor} 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
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
            object-fit: cover;
            background: ${branding.primaryColor};
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2rem;
            font-weight: bold;
        }
        h1 { color: #333; margin-bottom: 0.5rem; font-size: 1.8rem; }
        .subtitle { color: #666; margin-bottom: 2rem; font-size: 1rem; }
        .form-group { margin-bottom: 1rem; text-align: left; }
        label { display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500; }
        input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s;
            box-sizing: border-box;
        }
        input:focus { outline: none; border-color: ${branding.primaryColor}; }
        .btn {
            width: 100%;
            padding: 0.875rem;
            background: linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.secondaryColor} 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
            box-sizing: border-box;
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
            font-size: 0.9rem;
        }
        .loading { display: none; }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid ${branding.primaryColor};
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            margin: 0 auto 0.5rem;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .footer {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #e1e5e9;
            color: #666;
            font-size: 0.875rem;
        }
        .success {
            background: #d4edda;
            color: #155724;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
        }
        .powered-by {
            margin-top: 1rem;
            font-size: 0.75rem;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            ${branding.gymName.charAt(0)}
        </div>
        <h1>¡Bienvenido a ${branding.gymName}!</h1>
        <p class="subtitle">${branding.wifiWelcomeMessage}</p>

        <div class="error" id="error"></div>
        <div class="success" id="success" style="display: none;">
            <h3>✅ ¡Conectado!</h3>
            <p>Ya puedes navegar por Internet</p>
        </div>

        <form id="loginForm">
            <input type="hidden" name="sessionId" value="wifi_session_${Date.now()}">
            <input type="hidden" name="mac" value="${mac}">
            <input type="hidden" name="ip" value="${ip}">
            <input type="hidden" name="redirectUrl" value="${redirectUrl || '/'}">
            <input type="hidden" name="gymCode" value="${gymId || 'entrenatech'}">

            <div class="form-group">
                <label for="email">Email del Miembro</label>
                <input type="email" id="email" name="email" required autocomplete="email" placeholder="tu@email.com">
            </div>

            <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" required placeholder="Tu contraseña">
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
            <p>📶 Portal WiFi ${branding.gymName}</p>
            <div class="powered-by">
                Powered by EntrenaTech 🏋️
            </div>
        </div>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const form = e.target;
            const formData = new FormData(form);
            const errorDiv = document.getElementById('error');
            const successDiv = document.getElementById('success');
            const loginBtn = document.getElementById('loginBtn');
            const loading = document.getElementById('loading');

            // Mostrar loading
            loginBtn.style.display = 'none';
            loading.style.display = 'block';
            errorDiv.style.display = 'none';

            try {
                const response = await fetch('https://us-central1-entrenapp-2025.cloudfunctions.net/api/wifi/auth', {
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
                    successDiv.style.display = 'block';
                    form.style.display = 'none';

                    // Redirigir después de 2 segundos
                    setTimeout(() => {
                        window.location.href = result.redirectUrl || '/';
                    }, 2000);
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

        // Enfocar email al cargar
        document.getElementById('email').focus();
    </script>
</body>
</html>`;
}
async function generateWiFiWiFiToken(uid, gymId) {
    // Generar token de sesión personalizado para WiFi
    return admin.auth().createCustomToken(uid, {
        gymId,
        type: 'wifi_session',
        expiresIn: 480 * 60 * 1000 // 8 horas
    });
}
async function verifyWiFiToken(token) {
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        if (decodedToken.type !== 'wifi_session') {
            return null;
        }
        // Aquí iría lógica para verificar estado en Firestore
        return {
            sessionId: decodedToken.sessionId,
            memberId: decodedToken.uid,
            gymId: decodedToken.gymId,
            timeRemaining: 420,
            memberInfo: {
                name: 'Usuario Demo',
                membershipType: 'premium'
            }
        };
    }
    catch (error) {
        console.error('Error verificando token WiFi:', error);
        return null;
    }
}
async function recordWiFiAccess(access) {
    try {
        await admin.firestore().collection('wifiAccess').add(Object.assign(Object.assign({}, access), { timestamp: admin.firestore.FieldValue.serverTimestamp(), status: 'active' }));
    }
    catch (error) {
        console.error('Error registrando acceso WiFi:', error);
    }
}
async function getWiFiUsageStats(sessionId) {
    // Simular estadísticas de uso
    return {
        download: Math.floor(Math.random() * 500),
        upload: Math.floor(Math.random() * 100) // MB
    };
}
function getSessionDuration(membershipType) {
    const durations = {
        basic: 120,
        premium: 480,
        vip: 1440 // 24 horas
    };
    return durations[membershipType] || 120;
}
//# sourceMappingURL=index.js.map