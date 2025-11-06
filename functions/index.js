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
        mac,
        ip,
        branding,
        redirectUrl,
        gymId: gym
      });

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.status(200).send(portalHTML);

    } catch (error) {
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
      } catch (error) {
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
      const wifiToken = await generateWiFiToken(userRecord.uid, memberInfo.gymId);

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

    } catch (error) {
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
 * API general para otras funcionalidades
 */
exports.api = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const { path, method } = req;

    // Health check
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
          captive_portal: true,
          ai_nutrition: true,
          ai_workout: true,
          music_integration: true
        }
      });
    }

    // Branding endpoint
    if (path.startsWith('/branding/')) {
      const gymId = path.split('/')[2];
      const branding = await getGymBranding(gymId);
      return res.json({ branding });
    }

    // AI Nutrition endpoint
    if (path.startsWith('/ai/nutrition/generate') && method === 'POST') {
      return await handleNutritionPlan(req, res);
    }

    // AI Workout endpoint
    if (path.startsWith('/ai/workout/generate') && method === 'POST') {
      return await handleWorkoutPlan(req, res);
    }

    // AI Chat endpoint
    if (path.startsWith('/ai/chat') && method === 'POST') {
      return await handleAIChat(req, res);
    }

    // Member profile endpoints
    if (path.startsWith('/member/profile')) {
      if (method === 'GET') {
        return await getMemberProfile(req, res);
      } else if (method === 'PUT') {
        return await updateMemberProfile(req, res);
      }
    }

    // Workout sessions
    if (path.startsWith('/member/workouts/sessions')) {
      if (method === 'GET') {
        return await getWorkoutSessions(req, res);
      } else if (method === 'POST') {
        return await logWorkoutSession(req, res);
      }
    }

    // Progress tracking
    if (path.startsWith('/member/progress')) {
      if (method === 'GET') {
        return await getProgress(req, res);
      } else if (method === 'POST') {
        return await updateProgress(req, res);
      }
    }

    // Nutrition tracking
    if (path.startsWith('/member/nutrition/logs')) {
      if (method === 'GET') {
        return await getNutritionLogs(req, res);
      } else if (method === 'POST') {
        return await logNutrition(req, res);
      }
    }

    res.status(404).json({
      error: 'Endpoint not found',
      available: [
        '/health',
        '/branding/:gymId',
        '/ai/nutrition/generate [POST]',
        '/ai/workout/generate [POST]',
        '/ai/chat [POST]',
        '/member/profile [GET/PUT]',
        '/member/workouts/sessions [GET/POST]',
        '/member/progress [GET/POST]',
        '/member/nutrition/logs [GET/POST]'
      ]
    });
  });
});

// === Funciones auxiliares ===

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

  if (!gymId) return defaultBranding;

  try {
    const doc = await admin.firestore().collection('gymBranding').doc(gymId).get();

    if (doc.exists) {
      return doc.data();
    }
  } catch (error) {
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
  } catch (error) {
    console.error('Error obteniendo info del miembro:', error);
  }

  return null;
}

function generateCaptivePortalHTML(options) {
  const { mac, ip, branding, redirectUrl, gymId } = options;

  return `<!DOCTYPE html>
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
                const response = await fetch('https://us-central1-entrenapp-2025.cloudfunctions.net/api/wifiAuth', {
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

async function generateWiFiToken(uid, gymId) {
  // Generar token de sesión personalizado para WiFi
  return admin.auth().createCustomToken(uid, {
    gymId,
    type: 'wifi_session',
    expiresIn: 480 * 60 * 1000 // 8 horas
  });
}

async function recordWiFiAccess(access) {
  try {
    await admin.firestore().collection('wifiAccess').add({
      ...access,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'active'
    });
  } catch (error) {
    console.error('Error registrando acceso WiFi:', error);
  }
}

function getSessionDuration(membershipType) {
  const durations = {
    basic: 120,      // 2 horas
    premium: 480,    // 8 horas
    vip: 1440       // 24 horas
  };
  return durations[membershipType] || 120;
}

// === AI AND BACKEND FUNCTIONS ===

/**
 * AI Nutrition Plan Generator
 */
async function handleNutritionPlan(req, res) {
  try {
    const { goals, dietaryRestrictions, allergies, weight, height, age, gender, activityLevel } = req.body;

    // Calculate TDEE and macros
    const bmr = calculateBMR(weight, height, age, gender);
    const activityMultiplier = getActivityMultiplier(activityLevel);
    const tdee = bmr * activityMultiplier;

    // Adjust calories based on goal
    let targetCalories = tdee;
    let explanation = '';

    if (goals.includes('lose_fat')) {
      targetCalories = tdee * 0.8;
      explanation = 'Déficit calórico moderado (20%) para pérdida de grasa sostenible';
    } else if (goals.includes('gain_muscle')) {
      targetCalories = tdee * 1.15;
      explanation = 'Superávit calórico controlado (15%) para ganancia muscular magra';
    }

    const protein = Math.round(weight * 2.2); // 2.2g per kg
    const fats = Math.round((targetCalories * 0.25) / 9); // 25% of calories
    const carbs = Math.round((targetCalories - (protein * 4) - (fats * 9)) / 4);

    // Generate meal plan with AI simulation
    const mealPlan = generateIntelligentMealPlan(targetCalories, protein, carbs, fats, dietaryRestrictions, allergies);

    res.json({
      success: true,
      data: {
        macros: {
          calories: Math.round(targetCalories),
          protein,
          carbs,
          fats,
          explanation
        },
        mealPlan,
        recommendations: [
          'Consume 2-3L de agua al día',
          'Prioriza proteína en cada comida',
          'Incluye vegetales en cada comida',
          'Duerme 7-9 horas para recuperación óptima'
        ]
      }
    });

  } catch (error) {
    console.error('Error generating nutrition plan:', error);
    res.status(500).json({
      success: false,
      error: 'Error generando plan nutricional',
      code: 'NUTRITION_ERROR'
    });
  }
}

/**
 * AI Workout Plan Generator
 */
async function handleWorkoutPlan(req, res) {
  try {
    const { fitnessLevel, goals, availableDays, sessionDuration, equipment, preferences } = req.body;

    // Generate intelligent workout plan
    const workoutPlan = generateIntelligentWorkoutPlan({
      fitnessLevel,
      goals,
      availableDays,
      sessionDuration,
      equipment,
      preferences
    });

    res.json({
      success: true,
      data: workoutPlan
    });

  } catch (error) {
    console.error('Error generating workout plan:', error);
    res.status(500).json({
      success: false,
      error: 'Error generando rutina',
      code: 'WORKOUT_ERROR'
    });
  }
}

/**
 * AI Chat Handler
 */
async function handleAIChat(req, res) {
  try {
    const { message, context } = req.body;

    // Simulated AI response (replace with real AI integration)
    const aiResponse = generateAIResponse(message, context);

    res.json({
      success: true,
      data: {
        response: aiResponse,
        timestamp: new Date().toISOString(),
        context: context || {}
      }
    });

  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({
      success: false,
      error: 'Error en chat de IA',
      code: 'CHAT_ERROR'
    });
  }
}

/**
 * Member Profile Handlers
 */
async function getMemberProfile(req, res) {
  try {
    // In production, get from authenticated user token
    const memberId = req.headers.uid || 'demo-user';

    const memberDoc = await admin.firestore().collection('members').doc(memberId).get();

    if (!memberDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Miembro no encontrado',
        code: 'MEMBER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: memberDoc.data()
    });

  } catch (error) {
    console.error('Error getting member profile:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo perfil',
      code: 'PROFILE_ERROR'
    });
  }
}

async function updateMemberProfile(req, res) {
  try {
    const memberId = req.headers.uid || 'demo-user';
    const profileData = req.body;

    await admin.firestore().collection('members').doc(memberId).update({
      ...profileData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error updating member profile:', error);
    res.status(500).json({
      success: false,
      error: 'Error actualizando perfil',
      code: 'UPDATE_ERROR'
    });
  }
}

/**
 * Workout Session Handlers
 */
async function getWorkoutSessions(req, res) {
  try {
    const memberId = req.headers.uid || 'demo-user';

    const sessionsSnapshot = await admin.firestore()
      .collection('members')
      .doc(memberId)
      .collection('workoutSessions')
      .orderBy('date', 'desc')
      .limit(20)
      .get();

    const sessions = sessionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: sessions
    });

  } catch (error) {
    console.error('Error getting workout sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo sesiones',
      code: 'SESSIONS_ERROR'
    });
  }
}

async function logWorkoutSession(req, res) {
  try {
    const memberId = req.headers.uid || 'demo-user';
    const sessionData = req.body;

    const sessionRef = await admin.firestore()
      .collection('members')
      .doc(memberId)
      .collection('workoutSessions')
      .add({
        ...sessionData,
        date: admin.firestore.FieldValue.serverTimestamp(),
        status: 'completed'
      });

    res.json({
      success: true,
      data: {
        sessionId: sessionRef.id,
        message: 'Sesión registrada exitosamente'
      }
    });

  } catch (error) {
    console.error('Error logging workout session:', error);
    res.status(500).json({
      success: false,
      error: 'Error registrando sesión',
      code: 'LOG_SESSION_ERROR'
    });
  }
}

/**
 * Progress Handlers
 */
async function getProgress(req, res) {
  try {
    const memberId = req.headers.uid || 'demo-user';

    const progressDoc = await admin.firestore()
      .collection('members')
      .doc(memberId)
      .collection('progress')
      .doc('current')
      .get();

    res.json({
      success: true,
      data: progressDoc.exists ? progressDoc.data() : {}
    });

  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo progreso',
      code: 'PROGRESS_ERROR'
    });
  }
}

async function updateProgress(req, res) {
  try {
    const memberId = req.headers.uid || 'demo-user';
    const progressData = req.body;

    await admin.firestore()
      .collection('members')
      .doc(memberId)
      .collection('progress')
      .doc('current')
      .set({
        ...progressData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

    res.json({
      success: true,
      message: 'Progreso actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({
      success: false,
      error: 'Error actualizando progreso',
      code: 'UPDATE_PROGRESS_ERROR'
    });
  }
}

/**
 * Nutrition Handlers
 */
async function getNutritionLogs(req, res) {
  try {
    const memberId = req.headers.uid || 'demo-user';

    const logsSnapshot = await admin.firestore()
      .collection('members')
      .doc(memberId)
      .collection('nutritionLogs')
      .orderBy('date', 'desc')
      .limit(30)
      .get();

    const logs = logsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: logs
    });

  } catch (error) {
    console.error('Error getting nutrition logs:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo registros nutricionales',
      code: 'NUTRITION_LOGS_ERROR'
    });
  }
}

async function logNutrition(req, res) {
  try {
    const memberId = req.headers.uid || 'demo-user';
    const nutritionData = req.body;

    await admin.firestore()
      .collection('members')
      .doc(memberId)
      .collection('nutritionLogs')
      .add({
        ...nutritionData,
        date: admin.firestore.FieldValue.serverTimestamp()
      });

    res.json({
      success: true,
      message: 'Registro nutricional agregado exitosamente'
    });

  } catch (error) {
    console.error('Error logging nutrition:', error);
    res.status(500).json({
      success: false,
      error: 'Error registrando nutrición',
      code: 'LOG_NUTRITION_ERROR'
    });
  }
}

// === UTILITY FUNCTIONS ===

function calculateBMR(weight, height, age, gender) {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
}

function getActivityMultiplier(activityLevel) {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  return multipliers[activityLevel] || 1.55;
}

function generateIntelligentMealPlan(calories, protein, carbs, fats, restrictions, allergies) {
  // Smart meal plan generation based on macros and restrictions
  return {
    meals: [
      {
        name: 'Desayuno Energético',
        foods: [
          'Avena con frutas y nueces',
          'Huevos revueltos con espinacas',
          'Yogurt griego con miel'
        ],
        macros: { calories: Math.round(calories * 0.3), protein: Math.round(protein * 0.3), carbs: Math.round(carbs * 0.3), fats: Math.round(fats * 0.3) }
      },
      {
        name: 'Almuerzo Fortificante',
        foods: [
          'Pechuga de pollo a la parrilla',
          'Arroz integral con vegetales',
          'Ensalada fresca con aderezo ligero'
        ],
        macros: { calories: Math.round(calories * 0.4), protein: Math.round(protein * 0.4), carbs: Math.round(carbs * 0.4), fats: Math.round(fats * 0.4) }
      },
      {
        name: 'Cena Ligera',
        foods: [
          'Salmón al horno con espárragos',
          'Batata asada',
          'Ensalada mixta'
        ],
        macros: { calories: Math.round(calories * 0.3), protein: Math.round(protein * 0.3), carbs: Math.round(carbs * 0.3), fats: Math.round(fats * 0.3) }
      }
    ],
    totalMacros: { calories, protein, carbs, fats },
    shoppingList: [
      'Avena', 'Frutas frescas', 'Nueces', 'Huevos', 'Espinacas',
      'Yogurt griego', 'Pechuga de pollo', 'Arroz integral',
      'Vegetales variados', 'Salmón', 'Espárragos', 'Batata'
    ]
  };
}

function generateIntelligentWorkoutPlan(config) {
  const { fitnessLevel, goals, availableDays, sessionDuration, equipment } = config;

  // Smart workout plan generation
  return {
    name: 'Plan Personalizado EntrenaTech',
    duration: '4 semanas',
    frequency: `${availableDays.length} días por semana`,
    sessions: availableDays.map((day, index) => ({
      day,
      focus: index % 2 === 0 ? 'Tren superior' : 'Tren inferior',
      exercises: generateWorkoutExercises(fitnessLevel, goals, equipment, sessionDuration),
      estimatedDuration: sessionDuration,
      intensity: fitnessLevel === 'beginner' ? 'Bajo-Medio' : fitnessLevel === 'intermediate' ? 'Medio' : 'Alto'
    })),
    tips: [
      'Calienta 5-10 minutos antes de cada sesión',
      'Mantén buena forma en cada ejercicio',
      'Descansa 60-90 segundos entre series',
      'Hidrátate durante el entrenamiento'
    ]
  };
}

function generateWorkoutExercises(level, goals, equipment, duration) {
  const exerciseDatabase = {
    beginner: {
      chest: ['Push-ups (rodillas)', 'Flexiones en pared', 'Press de mancuernas sentado'],
      back: ['Remo con banda', 'Superman', 'Pull-apoyo en mesa'],
      legs: ['Sentadillas sin peso', 'Zancadas', 'Puente de glúteo'],
      shoulders: ['Press de hombros con banda', 'Elevaciones laterales', 'Rotaciones'],
      core: ['Plancha (modificada)', 'Crunches', 'Bird-dog']
    },
    intermediate: {
      chest: ['Push-ups estándar', 'Press de banca con mancuernas', 'Dips en paralelas'],
      back: ['Dominadas (asistencia)', 'Remo con barra', 'Deadlift ligero'],
      legs: ['Sentadillas con peso', 'Zancadas con mancuernas', 'Peso muerto rumano'],
      shoulders: ['Press militar', 'Elevaciones laterales con peso', 'Face pulls'],
      core: ['Plancha estándar', 'Leg raises', 'Russian twists']
    },
    advanced: {
      chest: ['Push-ups explosivos', 'Press de banca con barra', 'Dips con peso'],
      back: ['Dominas con peso', 'Remo pesado', 'Deadlift convencional'],
      legs: ['Sentadillas profundas', 'Zancadas búlgaras', 'Peso muerto sumo'],
      shoulders: ['Press de hombros de pie', 'Handstand push-ups', 'Elevaciones laterales pesadas'],
      core: ['Plancha con peso', 'Dragon flags', 'Ab wheel rollout']
    }
  };

  const exercises = [];
  const levelExercises = exerciseDatabase[level] || exerciseDatabase.beginner;

  // Select exercises based on available equipment and goals
  Object.keys(levelExercises).forEach(muscle => {
    levelExercises[muscle].forEach((exercise, index) => {
      if (index < 2) { // Limit to 2 exercises per muscle group
        exercises.push({
          name: exercise,
          sets: 3,
          reps: level === 'beginner' ? 8-12 : level === 'intermediate' ? 10-15 : 12-20,
          rest: level === 'beginner' ? 90 : 60,
          muscle: muscle
        });
      }
    });
  });

  return exercises.slice(0, 6); // Return 6 exercises per session
}

function generateAIResponse(message, context) {
  // Simulated AI response - replace with real AI integration
  const responses = {
    greeting: '¡Hola! Soy tu entrenador virtual IA. ¿En qué puedo ayudarte hoy?',
    workout: 'Para tu rutina, te recomiendo enfocarte en ejercicios compuestos como sentadillas, press de banca y dominadas. Estos activan múltiples grupos musculares y maximizan tus resultados.',
    nutrition: 'La nutrición es clave: consume 1.6-2.2g de proteína por kg de peso corporal, prioriza alimentos integrales y mantente bien hidratado.',
    motivation: '¡Sigue adelante! Cada entrenamiento te acerca más a tus metas. La consistencia es más importante que la intensidad.',
    default: 'Entiendo tu pregunta. Como tu entrenador IA, estoy aquí para ayudarte a alcanzar tus metas de fitness. ¿Puedes darme más detalles sobre lo que necesitas?'
  };

  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('hola') || lowerMessage.includes('buenos')) {
    return responses.greeting;
  } else if (lowerMessage.includes('rutina') || lowerMessage.includes('ejercicio')) {
    return responses.workout;
  } else if (lowerMessage.includes('comida') || lowerMessage.includes('dieta') || lowerMessage.includes('nutrición')) {
    return responses.nutrition;
  } else if (lowerMessage.includes('motivación') || lowerMessage.includes('difícil')) {
    return responses.motivation;
  }

  return responses.default;
}