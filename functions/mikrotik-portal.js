const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

// Inicializar Firebase Admin
admin.initializeApp();

/**
 * PORTAL CAUTIVO MIKROTIK - FIREBASE INTEGRATION
 *
 * Flujo:
 * 1. Usuario se conecta al WiFi del gym
 * 2. Mikrotik redirige a este portal cautivo
 * 3. Portal verifica en Firebase si el usuario es miembro válido
 * 4. Si es válido -> acceso GRATIS al gym y a la app
 * 5. Si no es miembro -> mostrar registro/pago
 */

// Endpoint principal del portal cautivo
exports.captivePortal = functions.https.onRequest(async (req, res) => {
  // Habilitar CORS para todas las solicitudes
  return cors(req, res, async () => {
    const { mac, ip, redirect_url } = req.query;
    const gymId = req.headers['x-gym-id'] || 'demo-gym';

    console.log(`🏋️ Portal Cautivo Request: MAC=${mac}, IP=${ip}, Gym=${gymId}`);

    try {
      // Validar parámetros requeridos
      if (!mac || !ip) {
        return res.status(400).json({
          success: false,
          error: 'Parámetros MAC e IP requeridos',
          code: 'MISSING_PARAMS'
        });
      }

      // Generar HTML del portal cautivo personalizado
      const portalHTML = await generatePortalHTML({
        mac,
        ip,
        gymId,
        redirectUrl: redirect_url
      });

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(portalHTML);

    } catch (error) {
      console.error('Error en portal cautivo:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      });
    }
  });
});

// Endpoint de autenticación del portal cautivo
exports.authenticatePortal = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    const { email, password, gymId, mac, deviceInfo } = req.body;

    console.log(`🔐 Autenticación Portal: Email=${email}, Gym=${gymId}, MAC=${mac}`);

    try {
      // 1. Autenticar usuario con Firebase Auth
      let userRecord;
      try {
        userRecord = await admin.auth().getUserByEmail(email);
        console.log(`✅ Usuario encontrado: ${userRecord.uid}`);
      } catch (error) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        });
      }

      // 2. Verificar si es miembro válido del gym
      const memberDoc = await admin.firestore()
        .collection('gyms')
        .doc(gymId)
        .collection('members')
        .doc(userRecord.uid)
        .get();

      if (!memberDoc.exists) {
        return res.status(403).json({
          success: false,
          error: 'No eres miembro de este gimnasio',
          code: 'NOT_MEMBER'
        });
      }

      const memberData = memberDoc.data();

      // 3. Verificar estado de membresía
      if (memberData.status !== 'active') {
        return res.status(403).json({
          success: false,
          error: 'Tu membresía no está activa',
          code: 'MEMBERSHIP_INACTIVE'
        });
      }

      // 4. Verificar suscripción de app (para acceso fuera del gym)
      const subscriptionDoc = await admin.firestore()
        .collection('users')
        .doc(userRecord.uid)
        .collection('subscriptions')
        .doc('mobile_app')
        .get();

      const hasActiveSubscription = subscriptionDoc.exists &&
        subscriptionDoc.data().status === 'active' &&
        new Date(subscriptionDoc.data().expiryDate) > new Date();

      // 5. Registrar sesión WiFi en Firebase
      await admin.firestore()
        .collection('wifi_sessions')
        .add({
          userId: userRecord.uid,
          gymId: gymId,
          macAddress: mac,
          ipAddress: req.ip,
          startTime: admin.firestore.FieldValue.serverTimestamp(),
          deviceInfo: deviceInfo || {},
          sessionType: 'gym_access',
          status: 'active'
        });

      // 6. Registrar dispositivo para acceso futuro
      await admin.firestore()
        .collection('users')
        .doc(userRecord.uid)
        .collection('devices')
        .doc(mac.replace(/:/g, '')) // Remover dos puntos para ser válido como ID
        .set({
          macAddress: mac,
          lastSeen: admin.firestore.FieldValue.serverTimestamp(),
          gymAccess: true,
          deviceInfo: deviceInfo || {}
        }, { merge: true });

      // 7. Generar token de acceso para Mikrotik
      const accessToken = await generateMikrotikToken({
        userId: userRecord.uid,
        gymId: gymId,
        mac: mac,
        ip: req.ip,
        expiry: new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 horas
      });

      console.log(`✅ Autenticación exitosa: ${userRecord.uid}`);

      // 8. Respuesta exitosa
      res.json({
        success: true,
        data: {
          user: {
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName || memberData.name,
            photoURL: userRecord.photoURL
          },
          member: {
            name: memberData.name,
            membershipType: memberData.membershipType || 'basic',
            status: memberData.status
          },
          subscription: {
            active: hasActiveSubscription,
            expiryDate: subscriptionDoc.exists ? subscriptionDoc.data().expiryDate : null
          },
          session: {
            accessToken: accessToken,
            duration: 480, // minutos
            gymAccess: true,
            appAccess: hasActiveSubscription
          },
          redirectUrl: '/member' // Redirigir al PWA después del login
        }
      });

    } catch (error) {
      console.error('Error en autenticación:', error);
      res.status(500).json({
        success: false,
        error: 'Error en autenticación',
        code: 'AUTH_ERROR'
      });
    }
  });
});

// Endpoint para verificar token de Mikrotik
exports.verifyMikrotikToken = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    const { token, mac, gymId } = req.query;

    try {
      const sessionDoc = await admin.firestore()
        .collection('mikrotik_tokens')
        .doc(token)
        .get();

      if (!sessionDoc.exists) {
        return res.status(401).json({
          valid: false,
          error: 'Token inválido'
        });
      }

      const sessionData = sessionDoc.data();

      // Verificar expiración y coincidencia de MAC
      if (new Date(sessionData.expiryDate) < new Date() || sessionData.macAddress !== mac) {
        return res.status(401).json({
          valid: false,
          error: 'Token expirado o inválido'
        });
      }

      res.json({
        valid: true,
        userId: sessionData.userId,
        gymId: sessionData.gymId,
        expiryDate: sessionData.expiryDate
      });

    } catch (error) {
      console.error('Error verificando token:', error);
      res.status(500).json({
        valid: false,
        error: 'Error interno'
      });
    }
  });
});

// Generar HTML del portal cautivo
async function generatePortalHTML({ mac, ip, gymId, redirectUrl }) {

  // Obtener información del gym desde Firebase
  let gymInfo = {
    name: 'EntrenaTech Gym',
    logoUrl: '/logo.png',
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    welcomeMessage: '¡Conecta y comienza tu entrenamiento!'
  };

  try {
    const gymDoc = await admin.firestore()
      .collection('gyms')
      .doc(gymId)
      .get();

    if (gymDoc.exists) {
      gymInfo = { ...gymInfo, ...gymDoc.data() };
    }
  } catch (error) {
    console.log('Error obteniendo info del gym, usando defaults:', error);
  }

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
            background: linear-gradient(135deg, ${gymInfo.primaryColor} 0%, ${gymInfo.secondaryColor} 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 450px;
            text-align: center;
        }
        .logo {
            width: 100px;
            height: 100px;
            margin: 0 auto 1.5rem;
            border-radius: 20px;
            object-fit: cover;
            border: 3px solid white;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        h1 {
            color: #333;
            margin-bottom: 0.5rem;
            font-size: 1.8rem;
            font-weight: 700;
        }
        .subtitle {
            color: #666;
            margin-bottom: 2rem;
            font-size: 1rem;
            line-height: 1.5;
        }
        .form-group {
            margin-bottom: 1.2rem;
            text-align: left;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            color: #333;
            font-weight: 600;
        }
        input {
            width: 100%;
            padding: 1rem;
            border: 2px solid #e1e5e9;
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.3s;
            background: rgba(255, 255, 255, 0.8);
        }
        input:focus {
            outline: none;
            border-color: ${gymInfo.primaryColor};
            background: white;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }
        .btn {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, ${gymInfo.primaryColor} 0%, ${gymInfo.secondaryColor} 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }
        .btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }
        .error {
            background: linear-gradient(135deg, #fee, #fdd);
            color: #c33;
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 1rem;
            display: none;
            border: 1px solid #fcc;
            animation: shake 0.5s;
        }
        .success {
            background: linear-gradient(135deg, #efe, #dfd);
            color: #3a3;
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 1rem;
            display: none;
            border: 1px solid #cfc;
        }
        .loading {
            display: none;
        }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid ${gymInfo.primaryColor};
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        .footer {
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e1e5e9;
            color: #666;
            font-size: 0.875rem;
        }
        .device-info {
            background: rgba(102, 126, 234, 0.1);
            padding: 0.8rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-size: 0.85rem;
            color: #555;
        }
        .premium-badge {
            background: linear-gradient(135deg, #f39c12, #e67e22);
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-bottom: 1rem;
            display: inline-block;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        .register-link {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e1e5e9;
        }
        .register-link a {
            color: ${gymInfo.primaryColor};
            text-decoration: none;
            font-weight: 600;
        }
        .register-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="${gymInfo.logoUrl}" alt="${gymInfo.name}" class="logo" onerror="this.style.display='none'">

        <div class="premium-badge">🏋️‍♂️ Acceso WiFi del Gym</div>

        <h1>¡Bienvenido a ${gymInfo.name}!</h1>
        <p class="subtitle">${gymInfo.welcomeMessage}</p>

        <div class="device-info">
            📱 <strong>Dispositivo:</strong> ${navigator.userAgent.includes('Mobile') ? 'Móvil' : 'Desktop'}<br>
            📶 <strong>MAC:</strong> ${mac}<br>
            💻 <strong>IP:</strong> ${ip}
        </div>

        <div class="error" id="error"></div>
        <div class="success" id="success"></div>

        <form id="loginForm">
            <input type="hidden" name="mac" value="${mac}">
            <input type="hidden" name="ip" value="${ip}">
            <input type="hidden" name="gymId" value="${gymId}">
            <input type="hidden" name="redirectUrl" value="${redirectUrl || '/member'}">

            <div class="form-group">
                <label for="email">📧 Email del Miembro</label>
                <input type="email" id="email" name="email" required
                       autocomplete="email"
                       placeholder="tu@email.com">
            </div>

            <div class="form-group">
                <label for="password">🔒 Contraseña</label>
                <input type="password" id="password" name="password" required
                       placeholder="Tu contraseña"
                       autocomplete="current-password">
            </div>

            <button type="submit" class="btn" id="loginBtn">
                🚀 Conectar y Navegar
            </button>

            <div class="loading" id="loading">
                <div class="spinner"></div>
                <p>🔄 Autenticando...</p>
            </div>
        </form>

        <div class="register-link">
            <p>¿No tienes cuenta? <a href="#" onclick="showRegisterInfo()">Regístrate aquí</a></p>
            <p>¿Olvidaste tu contraseña? <a href="#" onclick="showResetInfo()">Recupérala aquí</a></p>
        </div>

        <div class="footer">
            <p>💎 <strong>Acceso GRATIS dentro del gym</strong></p>
            <p>📱 <strong>Acceso Premium fuera del gym por $50 MXN/mes</strong></p>
            <p style="margin-top: 0.5rem; font-size: 0.75rem; opacity: 0.7;">
                Powered by EntrenaTech © 2024
            </p>
        </div>
    </div>

    <script>
        // Variables globales
        const API_BASE_URL = 'https://us-central1-entrenapp-2025.cloudfunctions.net';

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const form = e.target;
            const formData = new FormData(form);
            const errorDiv = document.getElementById('error');
            const successDiv = document.getElementById('success');
            const loginBtn = document.getElementById('loginBtn');
            const loading = document.getElementById('loading');

            // Ocultar mensajes anteriores
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';

            // Mostrar loading
            loginBtn.style.display = 'none';
            loading.style.display = 'block';

            try {
                const response = await fetch(\`\${API_BASE_URL}/authenticatePortal\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Gym-ID': '\${gymId}'
                    },
                    body: JSON.stringify({
                        email: formData.get('email'),
                        password: formData.get('password'),
                        gymId: formData.get('gymId'),
                        mac: formData.get('mac'),
                        deviceInfo: {
                            userAgent: navigator.userAgent,
                            platform: navigator.platform,
                            language: navigator.language,
                            timestamp: new Date().toISOString()
                        }
                    })
                });

                const result = await response.json();

                if (result.success) {
                    // Éxito
                    successDiv.innerHTML = \`
                        ✅ <strong>¡Conexión Exitosa!</strong><br>
                        Bienvenido(a) \${result.data.user.displayName || result.data.user.email}<br>
                        🏋️‍♂️ Acceso WiFi del gym: ACTIVO<br>
                        \${result.data.subscription.active ? '📱 Acceso App Premium: ACTIVO' : '📱 Activa app por $50 MXN/mes para acceso fuera del gym'}<br>
                        ⏰ Duración: 8 horas
                    \`;
                    successDiv.style.display = 'block';

                    // Redirigir después de 3 segundos
                    setTimeout(() => {
                        const redirectUrl = formData.get('redirectUrl') || result.data.redirectUrl;
                        window.location.href = redirectUrl;
                    }, 3000);

                } else {
                    // Error
                    errorDiv.innerHTML = \`❌ <strong>Error de autenticación</strong><br>\${result.error}\`;
                    errorDiv.style.display = 'block';
                    loginBtn.style.display = 'block';
                    loading.style.display = 'none';
                }

            } catch (error) {
                console.error('Error:', error);
                errorDiv.innerHTML = \`❌ <strong>Error de conexión</strong><br>Verifica tu conexión a internet e intenta nuevamente.\`;
                errorDiv.style.display = 'block';
                loginBtn.style.display = 'block';
                loading.style.display = 'none';
            }
        });

        function showRegisterInfo() {
            const errorDiv = document.getElementById('error');
            errorDiv.innerHTML = \`
                ℹ️ <strong>Información de Registro</strong><br>
                Para registrarte como miembro, acude a la recepción del gym o contacta al administrador.
                Una vez registrado, podrás usar este portal para acceder al WiFi.
            \`;
            errorDiv.style.display = 'block';
            errorDiv.style.background = 'linear-gradient(135deg, #e3f2fd, #bbdefb)';
            errorDiv.style.color = '#1976d2';
            errorDiv.style.borderColor = '#90caf9';
        }

        function showResetInfo() {
            const errorDiv = document.getElementById('error');
            errorDiv.innerHTML = \`
                ℹ️ <strong>Recuperación de Contraseña</strong><br>
                Contacta al administrador del gym para restablecer tu contraseña.
                También puedes usar la app EntrenaTech para recuperarla.
            \`;
            errorDiv.style.display = 'block';
            errorDiv.style.background = 'linear-gradient(135deg, #fff3e0, #ffe0b2)';
            errorDiv.style.color = '#f57c00';
            errorDiv.style.borderColor = '#ffb74d';
        }

        // Auto-enfoque en email al cargar
        window.addEventListener('load', () => {
            document.getElementById('email').focus();
        });

        // Prevención de envío múltiple
        let isSubmitting = false;
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            if (isSubmitting) {
                e.preventDefault();
                return false;
            }
            isSubmitting = true;
            setTimeout(() => { isSubmitting = false; }, 5000);
        });
    </script>
</body>
</html>`;
}

// Generar token para Mikrotik
async function generateMikrotikToken({ userId, gymId, mac, ip, expiry }) {
  const token = Buffer.from(`${userId}:${mac}:${Date.now()}`).toString('base64');

  // Guardar token en Firebase
  await admin.firestore()
    .collection('mikrotik_tokens')
    .doc(token)
    .set({
      userId,
      gymId,
      macAddress: mac,
      ipAddress: ip,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiryDate: expiry,
      status: 'active'
    });

  return token;
}