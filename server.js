const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para parsear JSON y URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde diferentes carpetas
app.use('/gym', express.static(path.join(__dirname, 'public', 'gym')));
app.use('/owner', express.static(path.join(__dirname, 'public', 'gym')));
app.use('/login', express.static(path.join(__dirname, 'public', 'login')));
app.use('/member', express.static(path.join(__dirname, 'public', 'member')));
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));
app.use(express.static(path.join(__dirname, 'public')));

// Portal WiFi endpoints
app.get('/api/wifi/start', (req, res) => {
    // Simular portal cautivo para demo
    const { mac, ip } = req.query;
    const branding = res.locals.branding;

    if (!mac || !ip) {
        return res.status(400).json({
            error: 'Se requieren parámetros MAC e IP',
            code: 'MISSING_PARAMS'
        });
    }

    // Generar HTML del portal cautivo con branding
    const portalHTML = generateCaptivePortalHTML({
        mac,
        ip,
        branding,
        redirectUrl: req.query.redirectUrl
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(portalHTML);
});

app.post('/api/wifi/authenticate', (req, res) => {
    // Simulación de autenticación para demo
    const { sessionId, email, password, gymCode } = req.body;
    const branding = res.locals.branding;

    // Simular validación (en producción sería con Firebase)
    setTimeout(() => {
        if (email && password) {
            res.json({
                success: true,
                redirectUrl: `/?gym=${branding?.gymId || 'demo'}`,
                memberInfo: {
                    name: 'Usuario Demo',
                    membershipType: 'premium',
                    sessionDuration: 480 // 8 horas
                }
            });
        } else {
            res.status(401).json({
                success: false,
                error: 'Credenciales inválidas',
                code: 'AUTH_FAILED'
            });
        }
    }, 1500); // Simular delay de autenticación
});

app.get('/api/wifi/status', (req, res) => {
    // Simulación de estado de sesión
    res.json({
        valid: true,
        session: {
            timeRemaining: 420, // minutos
            dataUsage: {
                download: 125, // MB
                upload: 45   // MB
            }
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'entrenatech-all-dashboards',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        features: {
            wifi_portal: true,
            white_label: true,
            ai_hybrid: true,
            captive_portal: true
        },
        apps: {
            member: '/member',
            gym: '/gym',
            login: '/login',
            admin: '/admin',
            main: '/',
            wifi: '/api/wifi/start'
        }
    });
});

// Para las rutas SPA, servir el index.html correspondiente
app.get('/gym/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gym', 'index.html'));
});

app.get('/owner/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gym', 'index.html'));
});

app.get('/login/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login', 'index.html'));
});

app.get('/member/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'member', 'index.html'));
});

app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

// Para cualquier otra ruta, servir el index.html principal
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Función para generar HTML del portal cautivo con branding
function generateCaptivePortalHTML({ mac, ip, branding, redirectUrl }) {
    const defaultBranding = {
        gymName: 'EntrenaTech',
        logoUrl: '/logo.png',
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        welcomeMessage: '¡Conecta y comienza tu entrenamiento!'
    };

    const brand = branding || defaultBranding;

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal WiFi - ${brand.gymName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, ${brand.primaryColor} 0%, ${brand.secondaryColor} 100%);
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
            object-fit: cover;
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
        }
        input:focus { outline: none; border-color: ${brand.primaryColor}; }
        .btn {
            width: 100%;
            padding: 0.875rem;
            background: linear-gradient(135deg, ${brand.primaryColor} 0%, ${brand.secondaryColor} 100%);
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
            border-top: 3px solid ${brand.primaryColor};
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
        .demo-badge {
            background: #f59e0b;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-bottom: 1rem;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="${brand.logoUrl}" alt="${brand.gymName}" class="logo" onerror="this.style.display='none'">
        <h1>¡Bienvenido a ${brand.gymName}!</h1>
        <p class="subtitle">${brand.welcomeMessage}</p>

        <div class="demo-badge">DEMO - Portal WiFi</div>

        <div class="error" id="error"></div>

        <form id="loginForm">
            <input type="hidden" name="mac" value="${mac}">
            <input type="hidden" name="ip" value="${ip}">
            <input type="hidden" name="redirectUrl" value="${redirectUrl || '/'}">

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
            <p>📶 MAC: ${mac}</p>
            <p>💻 IP: ${ip}</p>
            <p style="margin-top: 0.5rem; font-size: 0.75rem;">
                Credenciales de demo: admin@demo.com / password123
            </p>
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
                        sessionId: 'demo_session_' + Date.now(),
                        email: formData.get('email'),
                        password: formData.get('password'),
                        gymCode: 'demo'
                    })
                });

                const result = await response.json();

                if (result.success) {
                    // Simular redirección exitosa
                    document.body.innerHTML = \`
                        <div class="container">
                            <h1 style="color: #10b981; margin-bottom: 1rem;">✅ ¡Conectado!</h1>
                            <p style="color: #666; margin-bottom: 2rem;">
                                Bienvenido a ${brand.gymName}<br>
                                Tiempo de sesión: \${result.memberInfo.sessionDuration} minutos<br>
                                Tipo: \${result.memberInfo.membershipType}
                            </p>
                            <button class="btn" onclick="window.close()">Cerrar Ventana</button>
                        </div>
                    \`;
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

        // Autocompletar credenciales de demo
        setTimeout(() => {
            document.getElementById('email').value = 'admin@demo.com';
            document.getElementById('password').value = 'password123';
        }, 1000);
    </script>
</body>
</html>`;
}

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 EntrenaTech Platform running on port ${PORT}`);
    console.log(`📊 Main URL: http://localhost:${PORT}`);
    console.log(`🏋️ Member Portal: http://localhost:${PORT}/member`);
    console.log(`🏢 Gym Dashboard: http://localhost:${PORT}/gym`);
    console.log(`👑 Gym Owner: http://localhost:${PORT}/owner`);
    console.log(`🔐 Login App: http://localhost:${PORT}/login`);
    console.log(`🔥 SuperAdmin: http://localhost:${PORT}/admin`);
    console.log(`📶 WiFi Portal Demo: http://localhost:${PORT}/api/wifi/start?mac=DE:MO:MA:CA:DD:RE&ip=192.168.1.100`);
    console.log(`🎨 White Label: http://mikegym.localhost:${PORT} (simulado)`);
    console.log(`💡 Tips: Usa credenciales admin@demo.com / password123`);
});

module.exports = app;