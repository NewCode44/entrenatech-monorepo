const admin = require('firebase-admin');

// Inicializar Firebase Admin con service account (necesitarás descargar el archivo)
admin.initializeApp({
  credential: admin.credential.cert(require('./service-account-key.json'))
});

const db = admin.firestore();

// Gyms de ejemplo con branding personalizado
const gyms = [
  {
    id: 'entrenatech',
    gymName: 'EntrenaTech',
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    welcomeMessage: '¡Bienvenido a EntrenaTech! Conecta y entrena',
    wifiWelcomeMessage: '¡Conecta y comienza tu entrenamiento!',
    logoUrl: 'https://entrenapp-2025.web.app/logo.png',
    domain: 'entrenatech.web.app',
    membershipTypes: ['basic', 'premium', 'vip'],
    wifiSettings: {
      sessionDuration: { basic: 120, premium: 480, vip: 1440 },
      bandwidthLimit: { basic: 5, premium: 10, vip: 50 }, // Mbps
      simultaneousDevices: { basic: 1, premium: 2, vip: 5 }
    }
  },
  {
    id: 'powergym',
    gymName: 'PowerGym',
    primaryColor: '#ff6b6b',
    secondaryColor: '#ee5a6f',
    welcomeMessage: '¡Bienvenido a PowerGym! Máximo rendimiento',
    wifiWelcomeMessage: '¡Conecta y alcanza tu máximo potencial!',
    logoUrl: 'https://entrenapp-2025.web.app/powergym-logo.png',
    domain: 'powergym.entrenatech.app',
    membershipTypes: ['basic', 'premium'],
    wifiSettings: {
      sessionDuration: { basic: 180, premium: 720 },
      bandwidthLimit: { basic: 8, premium: 20 },
      simultaneousDevices: { basic: 1, premium: 3 }
    }
  },
  {
    id: 'zenfit',
    gymName: 'ZenFit',
    primaryColor: '#4ecdc4',
    secondaryColor: '#44a08d',
    welcomeMessage: 'Bienvenido a ZenFit - Equilibrio cuerpo y mente',
    wifiWelcomeMessage: 'Conecta y encuentra tu equilibrio interior',
    logoUrl: 'https://entrenapp-2025.web.app/zenfit-logo.png',
    domain: 'zenfit.entrenatech.app',
    membershipTypes: ['basic', 'premium', 'vip'],
    wifiSettings: {
      sessionDuration: { basic: 90, premium: 360, vip: 1080 },
      bandwidthLimit: { basic: 3, premium: 8, vip: 15 },
      simultaneousDevices: { basic: 1, premium: 2, vip: 4 }
    }
  }
];

// Miembros de ejemplo para testing
const members = [
  {
    uid: 'demo-member-1',
    name: 'Juan Pérez',
    email: 'juan@demo.com',
    gymId: 'entrenatech',
    membershipType: 'premium',
    membershipActive: true,
    membershipExpiry: new Date('2025-12-31'),
    joinDate: new Date('2024-01-15'),
    phone: '+521234567890',
    emergencyContact: 'María Pérez - +521234567891'
  },
  {
    uid: 'demo-member-2',
    name: 'Ana García',
    email: 'ana@demo.com',
    gymId: 'powergym',
    membershipType: 'basic',
    membershipActive: true,
    membershipExpiry: new Date('2025-11-30'),
    joinDate: new Date('2024-06-01'),
    phone: '+522345678901',
    emergencyContact: 'Carlos García - +522345678902'
  },
  {
    uid: 'demo-member-3',
    name: 'Roberto Silva',
    email: 'roberto@demo.com',
    gymId: 'zenfit',
    membershipType: 'vip',
    membershipActive: true,
    membershipExpiry: new Date('2026-01-15'),
    joinDate: new Date('2023-12-01'),
    phone: '+523456789012',
    emergencyContact: 'Laura Silva - +523456789013'
  }
];

async function setupDatabase() {
  console.log('🏋️ Configurando base de datos de EntrenaTech...');

  try {
    // Configurar branding de gyms
    console.log('📝 Creando branding de gyms...');
    for (const gym of gyms) {
      await db.collection('gymBranding').doc(gym.id).set(gym);
      console.log(`✅ Gym "${gym.gymName}" configurado`);
    }

    // Configurar miembros de ejemplo
    console.log('👥 Creando miembros de ejemplo...');
    for (const member of members) {
      await db.collection('members').doc(member.uid).set(member);
      console.log(`✅ Miembro "${member.name}" agregado a ${member.gymId}`);
    }

    // Crear colección de configuración global
    console.log('⚙️ Configurando ajustes globales...');
    await db.collection('settings').doc('global').set({
      platformName: 'EntrenaTech',
      version: '1.0.0',
      defaultCurrency: 'MXN',
      aiConfig: {
        maxTokensPerRequest: 4000,
        costPerToken: 0.00002, // MXN
        dailyBudgetPerGym: 100, // MXN
        enableChineseAPIs: true,
        enablePremiumFallback: true
      },
      wifiConfig: {
        defaultSessionDuration: 240, // minutos
        maxDailySessions: 5,
        trackingEnabled: true
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Crear estadísticas iniciales
    console.log('📊 Creando estadísticas iniciales...');
    const today = new Date();
    const statsRef = db.collection('dailyStats').doc(today.toISOString().split('T')[0]);

    const initialStats = {
      date: today,
      totalUsers: members.length,
      activeSessions: 0,
      totalDataUsage: 0,
      aiRequests: 0,
      aiCost: 0,
      gyms: gyms.reduce((acc, gym) => {
        acc[gym.id] = {
          activeUsers: members.filter(m => m.gymId === gym.id).length,
          sessions: 0,
          dataUsage: 0
        };
        return acc;
      }, {}),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await statsRef.set(initialStats);

    console.log('🎉 ¡Configuración completada exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`- ${gyms.length} gyms configurados`);
    console.log(`- ${members.length} miembros de ejemplo creados`);
    console.log('- Configuración global establecida');
    console.log('- Estadísticas iniciales creadas');

    console.log('\n🌐 URLs de prueba:');
    console.log('- Portal principal: https://entrenapp-2025.web.app');
    console.log('- Portal WiFi: https://us-central1-entrenapp-2025.cloudfunctions.net/wifiPortal?mac=AA:BB:CC:DD:EE:FF&ip=192.168.88.100&gym=entrenatech');
    console.log('- API Health: https://us-central1-entrenapp-2025.cloudfunctions.net/api/health');

    console.log('\n🔧 Para MikroTik:');
    console.log('- Hotspot login URL: https://us-central1-entrenapp-2025.cloudfunctions.net/wifiPortal');
    console.log('- Agregar parámetros: ?mac=$(mac)&ip=$(ip)&redirect-url=$(link-target)');

  } catch (error) {
    console.error('❌ Error en la configuración:', error);
    process.exit(1);
  }
}

// Ejecutar configuración
setupDatabase().then(() => {
  console.log('\n✨ Todo listo! La plataforma EntrenaTech está operativa.');
  process.exit(0);
});