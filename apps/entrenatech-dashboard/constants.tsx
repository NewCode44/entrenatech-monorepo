
import { NavItem, Template, Routine, Exercise, RoutineCategory, Member, Instructor, ClassCategory, GymClass } from '@/types/index';

export const NAVIGATION_ITEMS: NavItem[] = [
  { icon: 'Home', label: 'Dashboard' },
  { icon: 'Users', label: 'Miembros' },
  { icon: 'Calendar', label: 'Clases' },
  { icon: 'User', label: 'Entrenadores' },
  { icon: 'Dumbbell', label: 'Rutinas'},
  { icon: 'Plus', label: 'Creador de Rutinas'},
  { icon: 'ShoppingBag', label: 'Tienda'},
  { icon: 'Apple', label: 'Servicios de Nutrición'},
  { icon: 'Radio', label: 'Clases en Vivo'},
  { icon: 'Layout', label: 'Contenido Portal'},
  { icon: 'BarChart', label: 'Analíticas' },
  { icon: 'Settings', label: 'Configuración' },
];

export const PORTAL_TEMPLATES: Template[] = [
    {
        id: 'gym-classic-premium',
        name: 'Gym Clásico Premium',
        category: 'premium',
        icon: '🏋️‍♂️',
        description: 'Diseño elegante con dashboard de métricas en tiempo real.',
        features: ['WiFi Login', 'Clases en vivo', 'Reservas', 'Métricas IA'],
        preview: '/previews/gym-classic-premium.jpg',
        gradient: 'from-blue-500 to-blue-700',
        popularity: 95,
        conversions: '94%',
        badge: 'POPULAR'
    },
    {
        id: 'crossfit-beast',
        name: 'CrossFit Beast Mode',
        category: 'premium',
        icon: '⚡',
        description: 'Portal dinámico con WOD diario y leaderboard competitivo.',
        features: ['WOD Daily', 'Leaderboard', 'Timer', 'Community'],
        preview: '/previews/crossfit-beast.jpg',
        gradient: 'from-orange-500 to-red-600',
        popularity: 88,
        conversions: '87%',
        badge: 'HOT'
    },
    {
        id: 'wellness-zen',
        name: 'Wellness Zen Garden',
        category: 'wellness',
        icon: '🧘‍♀️',
        description: 'Experiencia relajante con booking de servicios spa integrado.',
        features: ['Spa Booking', 'Meditation', 'Wellness Tips', 'Mood Tracker'],
        preview: '/previews/wellness-zen.jpg',
        gradient: 'from-green-400 to-teal-600',
        popularity: 76,
        conversions: '91%',
        badge: 'ZEN'
    },
];

export const DASHBOARD_STATS = [
    { label: "Plantillas Disponibles", value: "24", change: "+6", trend: "up" as const, icon: 'Globe' as const },
    { label: "Plantillas Activas", value: "8", change: "+2", trend: "up" as const, icon: 'Zap' as const },
    { label: "Usuarios Conectados Hoy", value: "1,247", change: "+89", trend: "up" as const, icon: 'Wifi' as const },
    { label: "Conversión de Registro", value: "89%", change: "+12%", trend: "up" as const, icon: 'TrendingUp' as const },
    { label: "Revenue Mensual", value: "$24,500", change: "+$3,200", trend: "up" as const, icon: 'DollarSign' as const },
    { label: "Miembros Premium", value: "156", change: "+24", trend: "up" as const, icon: 'Crown' as const }
];

export const QUICK_ACTIONS = [
    { title: "Crear Rutina", description: "Diseña entrenamientos con IA", icon: 'Plus' as const, gradient: "from-orange-500 to-red-600", badge: "IA", page: 'Creador de Rutinas' as const},
    { title: "Tienda", description: "Gestiona productos y ventas", icon: 'ShoppingBag' as const, gradient: "from-blue-500 to-cyan-600", badge: "NUEVO", page: 'Tienda' as const},
    { title: "Clases en Vivo", description: "Streaming y programación", icon: 'Radio' as const, gradient: "from-red-500 to-pink-600", badge: "LIVE", page: 'Clases en Vivo' as const},
    { title: "Contenido Portal", description: "Gestiona frases y banners", icon: 'Layout' as const, gradient: "from-purple-500 to-indigo-600", badge: "HOT", page: 'Contenido Portal' as const},
    { title: "Gestión Miembros", description: "CRM avanzado", icon: 'Users' as const, gradient: "from-green-500 to-teal-600", page: 'Miembros' as const },
    { title: "IA Analytics", description: "Insights predictivos", icon: 'Brain' as const, gradient: "from-violet-500 to-purple-600", page: 'Analíticas' as const},
];

export const ATTENDANCE_DATA = [
  { name: 'Lun', 'Check-ins': 400 },
  { name: 'Mar', 'Check-ins': 300 },
  { name: 'Mié', 'Check-ins': 500 },
  { name: 'Jue', 'Check-ins': 450 },
  { name: 'Vie', 'Check-ins': 600 },
  { name: 'Sáb', 'Check-ins': 800 },
  { name: 'Dom', 'Check-ins': 750 },
];

export const EXERCISE_CATEGORIES = [
    { id: 'all', name: 'Todos' },
    { id: 'chest', name: 'Pecho' },
    { id: 'back', name: 'Espalda' },
    { id: 'legs', name: 'Piernas' },
    { id: 'shoulders', name: 'Hombros' },
    { id: 'arms', name: 'Brazos' },
    { id: 'core', name: 'Core' },
    { id: 'cardio', name: 'Cardio' },
    { id: 'functional', name: 'Funcional' },
    { id: 'plyometrics', name: 'Pliometría' },
    { id: 'mobility', name: 'Movilidad' },
    { id: 'olympic', name: 'Olímpico' },
];

export const EXERCISE_DATABASE: Exercise[] = [
    // Pecho (10)
    { id: 1, name: 'Press de Banca con Barra', category: 'chest', muscle_groups: ['Pecho', 'Hombros', 'Tríceps'], equipment: 'Barra', difficulty: 3 },
    { id: 2, name: 'Press de Banca con Mancuernas', category: 'chest', muscle_groups: ['Pecho', 'Hombros', 'Tríceps'], equipment: 'Mancuernas', difficulty: 3 },
    { id: 3, name: 'Flexiones (Push-ups)', category: 'chest', muscle_groups: ['Pecho', 'Hombros', 'Tríceps'], equipment: 'Bodyweight', difficulty: 2 },
    { id: 4, name: 'Aperturas con Mancuernas', category: 'chest', muscle_groups: ['Pecho'], equipment: 'Mancuernas', difficulty: 2 },
    { id: 5, name: 'Fondos en Paralelas (Dips)', category: 'chest', muscle_groups: ['Pecho', 'Tríceps', 'Hombros'], equipment: 'Máquina', difficulty: 4 },
    { id: 6, name: 'Press Inclinado con Barra', category: 'chest', muscle_groups: ['Pecho superior', 'Hombros'], equipment: 'Barra', difficulty: 3 },
    { id: 7, name: 'Cruce de Poleas (Cable Crossover)', category: 'chest', muscle_groups: ['Pecho'], equipment: 'Máquina', difficulty: 2 },
    { id: 8, name: 'Press Declinado con Mancuernas', category: 'chest', muscle_groups: ['Pecho inferior'], equipment: 'Mancuernas', difficulty: 3 },
    { id: 9, name: 'Máquina Pec-Deck', category: 'chest', muscle_groups: ['Pecho'], equipment: 'Máquina', difficulty: 2 },
    { id: 10, name: 'Svend Press', category: 'chest', muscle_groups: ['Pecho'], equipment: 'Disco', difficulty: 1 },
    // Espalda (10)
    { id: 11, name: 'Dominadas (Pull-ups)', category: 'back', muscle_groups: ['Espalda', 'Bíceps'], equipment: 'Bodyweight', difficulty: 4 },
    { id: 12, name: 'Remo con Barra (Bent-over Row)', category: 'back', muscle_groups: ['Espalda', 'Bíceps'], equipment: 'Barra', difficulty: 3 },
    { id: 13, name: 'Remo con Mancuerna (a una mano)', category: 'back', muscle_groups: ['Espalda', 'Bíceps'], equipment: 'Mancuerna', difficulty: 3 },
    { id: 14, name: 'Jalón al Pecho (Lat Pulldown)', category: 'back', muscle_groups: ['Espalda'], equipment: 'Máquina', difficulty: 2 },
    { id: 15, name: 'Peso Muerto Convencional', category: 'back', muscle_groups: ['Espalda', 'Isquiotibiales', 'Glúteos'], equipment: 'Barra', difficulty: 5 },
    { id: 16, name: 'Remo en T', category: 'back', muscle_groups: ['Espalda media'], equipment: 'Barra T', difficulty: 3 },
    { id: 17, name: 'Face Pulls', category: 'back', muscle_groups: ['Hombro posterior', 'Espalda alta'], equipment: 'Máquina', difficulty: 2 },
    { id: 18, name: 'Hiperextensiones', category: 'back', muscle_groups: ['Espalda baja', 'Glúteos'], equipment: 'Banco', difficulty: 2 },
    { id: 19, name: 'Remo Sentado en Polea', category: 'back', muscle_groups: ['Espalda'], equipment: 'Máquina', difficulty: 2 },
    { id: 20, name: 'Good Mornings', category: 'back', muscle_groups: ['Espalda baja', 'Isquiotibiales'], equipment: 'Barra', difficulty: 4 },
    // Piernas (15)
    { id: 21, name: 'Sentadillas con Barra (Squats)', category: 'legs', muscle_groups: ['Cuádriceps', 'Glúteos', 'Isquiotibiales'], equipment: 'Barra', difficulty: 4 },
    { id: 22, name: 'Prensa de Piernas', category: 'legs', muscle_groups: ['Cuádriceps', 'Glúteos'], equipment: 'Máquina', difficulty: 3 },
    { id: 23, name: 'Zancadas (Lunges)', category: 'legs', muscle_groups: ['Cuádriceps', 'Glúteos'], equipment: 'Mancuernas', difficulty: 2 },
    { id: 24, name: 'Curl Femoral', category: 'legs', muscle_groups: ['Isquiotibiales'], equipment: 'Máquina', difficulty: 2 },
    { id: 25, name: 'Elevación de Talones', category: 'legs', muscle_groups: ['Gemelos'], equipment: 'Máquina', difficulty: 2 },
    { id: 26, name: 'Sentadilla Goblet', category: 'legs', muscle_groups: ['Cuádriceps', 'Glúteos'], equipment: 'Pesa rusa', difficulty: 2 },
    { id: 27, name: 'Hip Thrust con Barra', category: 'legs', muscle_groups: ['Glúteos', 'Isquiotibiales'], equipment: 'Barra', difficulty: 3 },
    { id: 28, name: 'Peso Muerto Rumano', category: 'legs', muscle_groups: ['Isquiotibiales', 'Glúteos'], equipment: 'Barra', difficulty: 4 },
    { id: 29, name: 'Sentadilla Búlgara', category: 'legs', muscle_groups: ['Cuádriceps', 'Glúteos'], equipment: 'Mancuernas', difficulty: 4 },
    { id: 30, name: 'Extensiones de Cuádriceps', category: 'legs', muscle_groups: ['Cuádriceps'], equipment: 'Máquina', difficulty: 2 },
    { id: 31, name: 'Step-ups con peso', category: 'legs', muscle_groups: ['Cuádriceps', 'Glúteos'], equipment: 'Cajón', difficulty: 3 },
    { id: 32, name: 'Patada de Glúteo en Polea', category: 'legs', muscle_groups: ['Glúteos'], equipment: 'Máquina', difficulty: 2 },
    { id: 33, name: 'Abducción de Cadera en Máquina', category: 'legs', muscle_groups: ['Glúteo medio'], equipment: 'Máquina', difficulty: 2 },
    { id: 34, name: 'Sentadilla Frontal', category: 'legs', muscle_groups: ['Cuádriceps', 'Core'], equipment: 'Barra', difficulty: 5 },
    { id: 35, name: 'Prensa Hack', category: 'legs', muscle_groups: ['Cuádriceps'], equipment: 'Máquina', difficulty: 4 },
    // Hombros (10)
    { id: 36, name: 'Press Militar con Barra', category: 'shoulders', muscle_groups: ['Hombros', 'Tríceps'], equipment: 'Barra', difficulty: 4 },
    { id: 37, name: 'Press Arnold', category: 'shoulders', muscle_groups: ['Hombros'], equipment: 'Mancuernas', difficulty: 3 },
    { id: 38, name: 'Elevaciones Laterales', category: 'shoulders', muscle_groups: ['Hombros'], equipment: 'Mancuernas', difficulty: 2 },
    { id: 39, name: 'Elevaciones Frontales', category: 'shoulders', muscle_groups: ['Hombros'], equipment: 'Mancuernas', difficulty: 2 },
    { id: 40, name: 'Encogimientos de Hombros', category: 'shoulders', muscle_groups: ['Trapecios'], equipment: 'Barra', difficulty: 2 },
    { id: 41, name: 'Pájaro (Bent-over Lateral Raise)', category: 'shoulders', muscle_groups: ['Hombro posterior'], equipment: 'Mancuernas', difficulty: 3 },
    { id: 42, name: 'Remo al Mentón (Upright Row)', category: 'shoulders', muscle_groups: ['Hombros', 'Trapecios'], equipment: 'Barra', difficulty: 3 },
    { id: 43, name: 'Press de Hombro en Máquina', category: 'shoulders', muscle_groups: ['Hombros'], equipment: 'Máquina', difficulty: 2 },
    { id: 44, name: 'Landmine Press', category: 'shoulders', muscle_groups: ['Hombros', 'Core'], equipment: 'Barra', difficulty: 3 },
    { id: 45, name: 'Pike Push-ups', category: 'shoulders', muscle_groups: ['Hombros', 'Tríceps'], equipment: 'Bodyweight', difficulty: 4 },
    // Brazos (10)
    { id: 46, name: 'Curl de Bíceps con Barra', category: 'arms', muscle_groups: ['Bíceps'], equipment: 'Barra', difficulty: 3 },
    { id: 47, name: 'Curl de Martillo', category: 'arms', muscle_groups: ['Bíceps', 'Antebrazo'], equipment: 'Mancuernas', difficulty: 2 },
    { id: 48, name: 'Press Francés', category: 'arms', muscle_groups: ['Tríceps'], equipment: 'Barra', difficulty: 3 },
    { id: 49, name: 'Extensiones de Tríceps en Polea', category: 'arms', muscle_groups: ['Tríceps'], equipment: 'Máquina', difficulty: 2 },
    { id: 50, name: 'Curl de Concentración', category: 'arms', muscle_groups: ['Bíceps'], equipment: 'Mancuerna', difficulty: 2 },
    { id: 51, name: 'Chin-ups (Agarre supino)', category: 'arms', muscle_groups: ['Bíceps', 'Espalda'], equipment: 'Bodyweight', difficulty: 4 },
    { id: 52, name: 'Fondos de Tríceps en Banco', category: 'arms', muscle_groups: ['Tríceps'], equipment: 'Banco', difficulty: 2 },
    { id: 53, name: 'Curl Predicador', category: 'arms', muscle_groups: ['Bíceps'], equipment: 'Máquina', difficulty: 3 },
    { id: 54, name: 'Patada de Tríceps', category: 'arms', muscle_groups: ['Tríceps'], equipment: 'Mancuerna', difficulty: 2 },
    { id: 55, name: 'Curl de Muñeca', category: 'arms', muscle_groups: ['Antebrazo'], equipment: 'Mancuerna', difficulty: 1 },
    // Core (10)
    { id: 56, name: 'Plancha (Plank)', category: 'core', muscle_groups: ['Abdomen', 'Core'], equipment: 'Bodyweight', difficulty: 2 },
    { id: 57, name: 'Elevación de Piernas Colgado', category: 'core', muscle_groups: ['Abdomen'], equipment: 'Barra', difficulty: 4 },
    { id: 58, name: 'Crunch Abdominal', category: 'core', muscle_groups: ['Abdomen'], equipment: 'Bodyweight', difficulty: 1 },
    { id: 59, name: 'Russian Twist', category: 'core', muscle_groups: ['Oblicuos'], equipment: 'Pesa rusa', difficulty: 3 },
    { id: 60, name: 'Rueda Abdominal (Ab Wheel)', category: 'core', muscle_groups: ['Abdomen', 'Core'], equipment: 'Accesorio', difficulty: 5 },
    { id: 61, name: 'Mountain Climbers', category: 'core', muscle_groups: ['Core', 'Cardiovascular'], equipment: 'Bodyweight', difficulty: 2 },
    { id: 62, name: 'Pallof Press', category: 'core', muscle_groups: ['Core', 'Oblicuos'], equipment: 'Máquina', difficulty: 3 },
    { id: 63, name: 'Bicho Muerto (Dead Bug)', category: 'core', muscle_groups: ['Core', 'Estabilidad'], equipment: 'Bodyweight', difficulty: 2 },
    { id: 64, name: 'Dragon Flag', category: 'core', muscle_groups: ['Abdomen', 'Core'], equipment: 'Banco', difficulty: 5 },
    { id: 65, name: 'Toes to Bar', category: 'core', muscle_groups: ['Abdomen', 'Flexores de cadera'], equipment: 'Barra', difficulty: 5 },
    // Cardio (5)
    { id: 66, name: 'Correr en Cinta', category: 'cardio', muscle_groups: ['Cardiovascular'], equipment: 'Máquina', difficulty: 2 },
    { id: 67, name: 'Bicicleta Estática', category: 'cardio', muscle_groups: ['Cardiovascular'], equipment: 'Máquina', difficulty: 2 },
    { id: 68, name: 'Elíptica', category: 'cardio', muscle_groups: ['Cardiovascular'], equipment: 'Máquina', difficulty: 2 },
    { id: 69, name: 'Remo (Máquina)', category: 'cardio', muscle_groups: ['Cardiovascular', 'Espalda'], equipment: 'Máquina', difficulty: 3 },
    { id: 70, name: 'Saltar la Cuerda', category: 'cardio', muscle_groups: ['Cardiovascular'], equipment: 'Accesorio', difficulty: 3 },
    // Funcional (5)
    { id: 71, name: 'Burpees', category: 'functional', muscle_groups: ['Cuerpo completo'], equipment: 'Bodyweight', difficulty: 4 },
    { id: 72, name: 'Kettlebell Swings', category: 'functional', muscle_groups: ['Glúteos', 'Isquiotibiales', 'Core'], equipment: 'Pesa rusa', difficulty: 4 },
    { id: 73, name: 'Paseo del Granjero', category: 'functional', muscle_groups: ['Agarre', 'Core', 'Cuerpo completo'], equipment: 'Mancuernas', difficulty: 3 },
    { id: 74, name: 'Battle Ropes', category: 'functional', muscle_groups: ['Brazos', 'Hombros', 'Core'], equipment: 'Accesorio', difficulty: 4 },
    { id: 75, name: 'Empuje de Trineo (Sled Push)', category: 'functional', muscle_groups: ['Piernas', 'Potencia'], equipment: 'Trineo', difficulty: 4 },
    // Pliometría (5)
    { id: 76, name: 'Salto al Cajón (Box Jump)', category: 'plyometrics', muscle_groups: ['Piernas', 'Potencia'], equipment: 'Cajón', difficulty: 3 },
    { id: 77, name: 'Flexiones con Aplauso', category: 'plyometrics', muscle_groups: ['Pecho', 'Potencia'], equipment: 'Bodyweight', difficulty: 4 },
    { id: 78, name: 'Saltos de Tijera (Jumping Lunges)', category: 'plyometrics', muscle_groups: ['Piernas', 'Cardiovascular'], equipment: 'Bodyweight', difficulty: 3 },
    { id: 79, name: 'Lanzamiento de Balón Medicinal', category: 'plyometrics', muscle_groups: ['Core', 'Potencia'], equipment: 'Balón medicinal', difficulty: 3 },
    { id: 80, name: 'Broad Jump', category: 'plyometrics', muscle_groups: ['Piernas', 'Potencia'], equipment: 'Bodyweight', difficulty: 2 },
    // Movilidad y Estiramientos (5)
    { id: 81, name: 'Estiramiento del Gato-Vaca', category: 'mobility', muscle_groups: ['Espalda', 'Movilidad'], equipment: 'Bodyweight', difficulty: 1 },
    { id: 82, name: 'Rotaciones de Cadera 90/90', category: 'mobility', muscle_groups: ['Cadera', 'Movilidad'], equipment: 'Bodyweight', difficulty: 2 },
    { id: 83, name: 'Estiramiento del Piramidal', category: 'mobility', muscle_groups: ['Glúteos', 'Flexibilidad'], equipment: 'Bodyweight', difficulty: 1 },
    { id: 84, name: 'Círculos de Brazos', category: 'mobility', muscle_groups: ['Hombros', 'Calentamiento'], equipment: 'Bodyweight', difficulty: 1 },
    { id: 85, name: 'Sentadilla Profunda Sostenida', category: 'mobility', muscle_groups: ['Cadera', 'Tobillo', 'Movilidad'], equipment: 'Bodyweight', difficulty: 2 },
    // Levantamiento Olímpico (5)
    { id: 86, name: 'Arrancada (Snatch)', category: 'olympic', muscle_groups: ['Cuerpo completo', 'Potencia'], equipment: 'Barra', difficulty: 5 },
    { id: 87, name: 'Cargada y Envión (Clean and Jerk)', category: 'olympic', muscle_groups: ['Cuerpo completo', 'Potencia'], equipment: 'Barra', difficulty: 5 },
    { id: 88, name: 'Power Clean', category: 'olympic', muscle_groups: ['Cuerpo completo', 'Potencia'], equipment: 'Barra', difficulty: 4 },
    { id: 89, name: 'Overhead Squat', category: 'olympic', muscle_groups: ['Piernas', 'Core', 'Estabilidad'], equipment: 'Barra', difficulty: 5 },
    { id: 90, name: 'Snatch Pull', category: 'olympic', muscle_groups: ['Espalda', 'Piernas', 'Potencia'], equipment: 'Barra', difficulty: 4 },
];


export const TOP_EXERCISES: Exercise[] = EXERCISE_DATABASE.filter(e => [1, 3, 11, 12, 15, 21, 36, 46, 56, 71].includes(e.id));

export const ROUTINES_DATA: Routine[] = [
    {
        id: 'routine-1',
        name: 'Fuerza Total para Principiantes',
        description: 'Una rutina de cuerpo completo para empezar a construir una base de fuerza sólida.',
        category: 'strength',
        difficulty: 2,
        duration: 45,
        assignedMembers: 23,
        exercises: EXERCISE_DATABASE.filter(e => [21, 3, 1, 36, 56])
    },
    {
        id: 'routine-2',
        name: 'Cardio Quema Grasa',
        description: 'Sesión de alta intensidad para maximizar la quema de calorías y mejorar la resistencia.',
        category: 'cardio',
        difficulty: 3,
        duration: 30,
        assignedMembers: 41,
        exercises: EXERCISE_DATABASE.filter(e => [66, 70, 61])
    },
    {
        id: 'routine-3',
        name: 'HIIT Extremo',
        description: 'Entrenamiento interválico de alta intensidad para llevar tu condición física al límite.',
        category: 'hiit',
        difficulty: 5,
        duration: 25,
        assignedMembers: 12,
        exercises: EXERCISE_DATABASE.filter(e => [71, 72, 76, 74])
    },
    {
        id: 'routine-4',
        name: 'Flexibilidad y Movilidad',
        description: 'Rutina enfocada en mejorar el rango de movimiento y la recuperación muscular.',
        category: 'flexibility',
        difficulty: 1,
        duration: 35,
        assignedMembers: 55,
        exercises: EXERCISE_DATABASE.filter(e => [81, 82, 83])
    },
];

export const ROUTINE_CATEGORIES: { id: RoutineCategory, name: string }[] = [
    { id: 'strength', name: 'Fuerza' },
    { id: 'cardio', name: 'Cardio' },
    { id: 'hiit', name: 'HIIT' },
    { id: 'flexibility', name: 'Flexibilidad' },
    { id: 'custom', name: 'Personalizadas' },
];

export const MEMBERS_DATA: Member[] = [
  { id: 'mem-1', name: 'Carlos Santana', email: 'c.santana@example.com', phone: '555-0101', avatar: 'https://i.pravatar.cc/40?u=mem-1', status: 'active', plan: 'vip', joinDate: '2023-01-15' },
  { id: 'mem-2', name: 'Ana Fernández', email: 'a.fernandez@example.com', phone: '555-0102', avatar: 'https://i.pravatar.cc/40?u=mem-2', status: 'active', plan: 'premium', joinDate: '2023-02-20' },
  { id: 'mem-3', name: 'Pedro Pascal', email: 'p.pascal@example.com', phone: '555-0103', avatar: 'https://i.pravatar.cc/40?u=mem-3', status: 'inactive', plan: 'basic', joinDate: '2023-03-10' },
  { id: 'mem-4', name: 'Isabela Moner', email: 'i.moner@example.com', phone: '555-0104', avatar: 'https://i.pravatar.cc/40?u=mem-4', status: 'active', plan: 'premium', joinDate: '2023-04-05' },
  { id: 'mem-5', name: 'Javier Bardem', email: 'j.bardem@example.com', phone: '555-0105', avatar: 'https://i.pravatar.cc/40?u=mem-5', status: 'suspended', plan: 'vip', joinDate: '2023-05-12' },
  { id: 'mem-6', name: 'Sofia Vergara', email: 's.vergara@example.com', phone: '555-0106', avatar: 'https://i.pravatar.cc/40?u=mem-6', status: 'active', plan: 'basic', joinDate: '2023-06-18' },
  { id: 'mem-7', name: 'Diego Luna', email: 'd.luna@example.com', phone: '555-0107', avatar: 'https://i.pravatar.cc/40?u=mem-7', status: 'active', plan: 'premium', joinDate: '2023-07-22' },
  { id: 'mem-8', name: 'Eiza González', email: 'e.gonzalez@example.com', phone: '555-0108', avatar: 'https://i.pravatar.cc/40?u=mem-8', status: 'active', plan: 'vip', joinDate: '2023-08-30' },
  { id: 'mem-9', name: 'Gael García Bernal', email: 'g.bernal@example.com', phone: '555-0109', avatar: 'https://i.pravatar.cc/40?u=mem-9', status: 'inactive', plan: 'basic', joinDate: '2023-09-05' },
  { id: 'mem-10', name: 'Salma Hayek', email: 's.hayek@example.com', phone: '555-0110', avatar: 'https://i.pravatar.cc/40?u=mem-10', status: 'active', plan: 'premium', joinDate: '2023-10-11' },
  { id: 'mem-11', name: 'Benicio Del Toro', email: 'b.deltoro@example.com', phone: '555-0111', avatar: 'https://i.pravatar.cc/40?u=mem-11', status: 'active', plan: 'vip', joinDate: '2023-11-19' },
  { id: 'mem-12', name: 'Penélope Cruz', email: 'p.cruz@example.com', phone: '555-0112', avatar: 'https://i.pravatar.cc/40?u=mem-12', status: 'suspended', plan: 'premium', joinDate: '2023-12-01' },
  { id: 'mem-13', name: 'Oscar Isaac', email: 'o.isaac@example.com', phone: '555-0113', avatar: 'https://i.pravatar.cc/40?u=mem-13', status: 'active', plan: 'basic', joinDate: '2024-01-08' },
  { id: 'mem-14', name: 'Zoe Saldaña', email: 'z.saldana@example.com', phone: '555-0114', avatar: 'https://i.pravatar.cc/40?u=mem-14', status: 'active', plan: 'premium', joinDate: '2024-01-15' },
  { id: 'mem-15', name: 'Wagner Moura', email: 'w.moura@example.com', phone: '555-0115', avatar: 'https://i.pravatar.cc/40?u=mem-15', status: 'active', plan: 'vip', joinDate: '2024-02-02' },
  { id: 'mem-16', name: 'Morena Baccarin', email: 'm.baccarin@example.com', phone: '555-0116', avatar: 'https://i.pravatar.cc/40?u=mem-16', status: 'inactive', plan: 'basic', joinDate: '2024-02-10' },
  { id: 'mem-17', name: 'Rodrigo Santoro', email: 'r.santoro@example.com', phone: '555-0117', avatar: 'https://i.pravatar.cc/40?u=mem-17', status: 'active', plan: 'premium', joinDate: '2024-03-05' },
  { id: 'mem-18', name: 'Alice Braga', email: 'a.braga@example.com', phone: '555-0118', avatar: 'https://i.pravatar.cc/40?u=mem-18', status: 'active', plan: 'vip', joinDate: '2024-03-12' },
  { id: 'mem-19', name: 'Adria Arjona', email: 'a.arjona@example.com', phone: '555-0119', avatar: 'https://i.pravatar.cc/40?u=mem-19', status: 'active', plan: 'basic', joinDate: '2024-04-01' },
  { id: 'mem-20', name: 'Pedro Alonso', email: 'p.alonso@example.com', phone: '555-0120', avatar: 'https://i.pravatar.cc/40?u=mem-20', status: 'active', plan: 'premium', joinDate: '2024-04-09' },
  { id: 'mem-21', name: 'Úrsula Corberó', email: 'u.corbero@example.com', phone: '555-0121', avatar: 'https://i.pravatar.cc/40?u=mem-21', status: 'suspended', plan: 'vip', joinDate: '2024-04-15' },
  { id: 'mem-22', name: 'Álvaro Morte', email: 'a.morte@example.com', phone: '555-0122', avatar: 'https://i.pravatar.cc/40?u=mem-22', status: 'active', plan: 'premium', joinDate: '2024-05-03' },
  { id: 'mem-23', name: 'Itziar Ituño', email: 'i.ituno@example.com', phone: '555-0123', avatar: 'https://i.pravatar.cc/40?u=mem-23', status: 'active', plan: 'basic', joinDate: '2024-05-11' },
  { id: 'mem-24', name: 'Jaime Lorente', email: 'j.lorente@example.com', phone: '555-0124', avatar: 'https://i.pravatar.cc/40?u=mem-24', status: 'inactive', plan: 'premium', joinDate: '2024-05-20' },
  { id: 'mem-25', name: 'Miguel Herrán', email: 'm.herran@example.com', phone: '555-0125', avatar: 'https://i.pravatar.cc/40?u=mem-25', status: 'active', plan: 'vip', joinDate: '2024-06-01' },
];

export const INSTRUCTORS_DATA: Instructor[] = [
    { id: 'inst-1', name: 'Elena Torres', email: 'elena.t@entrenatech.com', phone: '555-0201', avatar: 'https://i.pravatar.cc/80?u=inst-1', specialties: ['Yoga', 'Flexibilidad', 'Movilidad'], bio: 'Instructora certificada de Yoga con más de 10 años de experiencia en estilos Vinyasa y Hatha. Apasionada por ayudar a los miembros a encontrar el equilibrio entre mente y cuerpo.', status: 'active', classesTaught: 12, activeMembers: 45 },
    { id: 'inst-2', name: 'Marco Rojas', email: 'marco.r@entrenatech.com', phone: '555-0202', avatar: 'https://i.pravatar.cc/80?u=inst-2', specialties: ['Spinning', 'Cardio', 'HIIT'], bio: 'Ex-ciclista profesional y especialista en entrenamiento cardiovascular de alta intensidad. Sus clases de Spinning son legendarias por su energía y música motivadora.', status: 'active', classesTaught: 25, activeMembers: 80 },
    { id: 'inst-3', name: 'Sofia Castro', email: 'sofia.c@entrenatech.com', phone: '555-0203', avatar: 'https://i.pravatar.cc/80?u=inst-3', specialties: ['CrossFit', 'Funcional', 'Olímpico'], bio: 'Entrenadora de CrossFit Nivel 2 y competidora regional. Se especializa en levantamiento olímpico y en ayudar a atletas a superar sus límites de fuerza y resistencia.', status: 'active', classesTaught: 18, activeMembers: 62 },
    { id: 'inst-4', name: 'Javier Nuñez', email: 'javier.n@entrenatech.com', phone: '555-0204', avatar: 'https://i.pravatar.cc/80?u=inst-4', specialties: ['Boxeo', 'Fuerza'], bio: 'Entrenador de boxeo con experiencia en competición amateur. Experto en técnica de golpeo, defensa y acondicionamiento físico específico para deportes de combate.', status: 'active', classesTaught: 15, activeMembers: 38 },
    { id: 'inst-5', name: 'Laura Méndez', email: 'laura.m@entrenatech.com', phone: '555-0205', avatar: 'https://i.pravatar.cc/80?u=inst-5', specialties: ['Pliometría', 'Funcional'], bio: 'Especialista en rendimiento deportivo, enfocada en el desarrollo de la potencia y la agilidad a través de entrenamientos pliométricos y funcionales.', status: 'inactive', classesTaught: 0, activeMembers: 0 },
];


export const CLASS_CATEGORIES_DATA: ClassCategory[] = [
    { id: 'cat-1', name: 'Yoga', color: 'text-green-400', lightColor: 'bg-green-500/10' },
    { id: 'cat-2', name: 'CrossFit', color: 'text-red-400', lightColor: 'bg-red-500/10' },
    { id: 'cat-3', name: 'Spinning', color: 'text-blue-400', lightColor: 'bg-blue-500/10' },
    { id: 'cat-4', name: 'Boxeo', color: 'text-yellow-400', lightColor: 'bg-yellow-500/10' },
    { id: 'cat-5', name: 'Funcional', color: 'text-purple-400', lightColor: 'bg-purple-500/10' },
];

export const CLASSES_DATA: GymClass[] = [
    // Lunes
    { id: 'class-1', name: 'Yoga Vinyasa', instructorId: 'inst-1', categoryId: 'cat-1', description: 'Flujo dinámico para empezar la semana con energía.', startTime: '07:00', duration: 60, dayOfWeek: 1, capacity: 20, enrolled: 18 },
    { id: 'class-2', name: 'Spinning Rítmico', instructorId: 'inst-2', categoryId: 'cat-3', description: 'Sube tu ritmo cardíaco con la mejor música.', startTime: '18:00', duration: 45, dayOfWeek: 1, capacity: 25, enrolled: 25 },
    // Martes
    { id: 'class-3', name: 'CrossFit WOD', instructorId: 'inst-3', categoryId: 'cat-2', description: 'Workout of the Day para desafiar tus límites.', startTime: '19:00', duration: 60, dayOfWeek: 2, capacity: 15, enrolled: 12 },
    // Miércoles
    { id: 'class-4', name: 'Boxeo Técnico', instructorId: 'inst-4', categoryId: 'cat-4', description: 'Aprende los fundamentos y mejora tu técnica de golpeo.', startTime: '18:30', duration: 75, dayOfWeek: 3, capacity: 18, enrolled: 10 },
    { id: 'class-5', name: 'Yoga Restaurativo', instructorId: 'inst-1', categoryId: 'cat-1', description: 'Relajación y estiramientos profundos.', startTime: '08:00', duration: 60, dayOfWeek: 3, capacity: 20, enrolled: 15 },
    // Jueves
    { id: 'class-6', name: 'Funcional HIIT', instructorId: 'inst-3', categoryId: 'cat-5', description: 'Entrenamiento de alta intensidad en circuito.', startTime: '07:30', duration: 45, dayOfWeek: 4, capacity: 22, enrolled: 20 },
    // Viernes
    { id: 'class-7', name: 'CrossFit Endurance', instructorId: 'inst-3', categoryId: 'cat-2', description: 'Enfocado en resistencia y capacidad aeróbica.', startTime: '18:00', duration: 90, dayOfWeek: 5, capacity: 15, enrolled: 15 },
    // Sábado
    { id: 'class-8', name: 'Spinning de Montaña', instructorId: 'inst-2', categoryId: 'cat-3', description: 'Simulación de rutas con alta resistencia.', startTime: '10:00', duration: 60, dayOfWeek: 6, capacity: 25, enrolled: 21 },
    { id: 'class-9', name: 'Boxeo Sparring', instructorId: 'inst-4', categoryId: 'cat-4', description: 'Práctica de combate controlado (requiere experiencia).', startTime: '11:00', duration: 60, dayOfWeek: 6, capacity: 12, enrolled: 8 },
];

export const ANALYTICS_KPIS = [
    { title: 'Ingresos Totales (Mes)', value: '$24,500', change: '+15.2%', icon: 'DollarSign' as const },
    { title: 'Crecimiento de Miembros (Mes)', value: '+42', change: '+8.1%', icon: 'TrendingUp' as const },
    { title: 'Ocupación de Clases (Promedio)', value: '82%', change: '-2.5%', icon: 'CalendarCheck' as const },
    { title: 'Valor de Vida del Cliente (LTV)', value: '$1,250', change: '+$50', icon: 'Coins' as const },
];

export const REVENUE_CHART_DATA = [
    { name: 'Ene', Ingresos: 18000, Gastos: 15000 },
    { name: 'Feb', Ingresos: 20000, Gastos: 16000 },
    { name: 'Mar', Ingresos: 22000, Gastos: 17000 },
    { name: 'Abr', Ingresos: 21000, Gastos: 16500 },
    { name: 'May', Ingresos: 24000, Gastos: 18000 },
    { name: 'Jun', Ingresos: 24500, Gastos: 18200 },
];

export const MEMBER_GROWTH_DATA = [
    { name: 'Ene', Nuevos: 30, Bajas: 10 },
    { name: 'Feb', Nuevos: 35, Bajas: 12 },
    { name: 'Mar', Nuevos: 40, Bajas: 8 },
    { name: 'Abr', Nuevos: 38, Bajas: 15 },
    { name: 'May', Nuevos: 45, Bajas: 11 },
    { name: 'Jun', Nuevos: 42, Bajas: 9 },
];

export const CLASS_POPULARITY_DATA = [
    { name: 'Spinning', asistencia: 450 },
    { name: 'CrossFit', asistencia: 380 },
    { name: 'Yoga', asistencia: 320 },
    { name: 'Funcional', asistencia: 280 },
    { name: 'Boxeo', asistencia: 210 },
];

export const MEMBER_DEMOGRAPHICS_DATA = {
    byPlan: [
        { name: 'VIP', value: 85, fill: '#FFD700' },
        { name: 'Premium', value: 210, fill: '#2196F3' },
        { name: 'Básico', value: 155, fill: '#4A5568' },
    ],
    byStatus: [
        { name: 'Activo', value: 410, fill: '#4CAF50' },
        { name: 'Inactivo', value: 25, fill: '#6C757D' },
        { name: 'Suspendido', value: 15, fill: '#FF9800' },
    ]
};