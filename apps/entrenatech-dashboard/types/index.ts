export type Page =
  | 'Dashboard' | 'Miembros' | 'Clases' | 'Entrenadores'
  | 'Rutinas' | 'Creador de Rutinas'
  | 'Tienda' | 'Clases en Vivo' | 'Contenido Portal'
  | 'Analíticas' | 'Configuración';

export type IconName =
  | 'Home' | 'Users' | 'Calendar' | 'User' | 'BarChart' | 'Globe' | 'Bell' | 'ChevronDown'
  | 'CheckCircle' | 'DollarSign' | 'Zap' | 'Settings' | 'TrendingUp' | 'Wifi' | 'Crown'
  | 'Plus' | 'Brain' | 'Megaphone' | 'Download' | 'ArrowRight' | 'Eye' | 'Palette' | 'Heart'
  | 'BarChart3' | 'ArrowUp' | 'ArrowDown' | 'Menu' | 'Dumbbell' | 'Upload' | 'Play'
  | 'Grid3X3' | 'List' | 'Star' | 'MoreVertical' | 'Edit' | 'Copy' | 'UserPlus' | 'Trash'
  | 'Clock' | 'Activity' | 'ArrowLeft' | 'Save' | 'Search' | 'GripVertical' | 'X' | 'Library'
  | 'UserCog' | 'UserX' | 'FileText' | 'UserCheck' | 'IdCard' | 'Camera' | 'UploadCloud' | 'Phone'
  | 'Shapes' | 'UsersRound' | 'BarChartHorizontal' | 'Sparkles' | 'ClipboardList'
  | 'FileJson' | 'FileUp' | 'LineChart' | 'Coins' | 'CalendarCheck' | 'PieChart'
  | 'ShoppingBag' | 'Radio' | 'Layout' | 'Package' | 'Archive' | 'AlertTriangle' | 'MessageSquare' | 'Trash2';

export interface NavItem {
  icon: IconName;
  label: Page;
}

export interface Template {
    id: string;
    name: string;
    category: 'premium' | 'wellness' | 'combat' | 'functional';
    icon: string;
    description: string;
    features: string[];
    preview: string;
    gradient: string;
    popularity: number;
    conversions: string;
    badge: string;
}

export interface Exercise {
  id: number
  name: string
  category: string
  muscle_groups: string[]
  equipment: string
  difficulty: 1 | 2 | 3 | 4 | 5
  image?: string
  sets?: number
  reps?: string
  rest?: string
}

export type RoutineCategory = 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'custom';

export interface Routine {
  id: string
  name: string
  description: string
  category: RoutineCategory
  difficulty: 1 | 2 | 3 | 4 | 5
  duration: number // minutes
  exercises: Exercise[]
  assignedMembers?: number
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'basic' | 'premium' | 'vip';
  joinDate: string;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  specialties: string[];
  bio: string;
  status: 'active' | 'inactive';
  classesTaught: number;
  activeMembers: number;
}

export interface ClassCategory {
  id: string;
  name: string;
  color: string;
  lightColor: string;
}

export interface GymClass {
  id: string;
  name: string;
  instructorId: string;
  categoryId: string;
  description: string;
  startTime: string; // "HH:MM" format
  duration: number; // in minutes
  dayOfWeek: number; // 1=Monday, 2=Tuesday... 7=Sunday
  capacity: number;
  enrolled: number;
}