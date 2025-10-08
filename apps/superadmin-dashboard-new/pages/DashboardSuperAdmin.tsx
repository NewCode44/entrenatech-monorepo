import React from 'react';
import {
  Building2,
  Users,
  DollarSign,
  Router,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Wifi,
  WifiOff,
  UserPlus,
  CreditCard,
  Server
} from 'lucide-react';

interface DashboardStats {
  totalGyms: number;
  activeGyms: number;
  totalMembers: number;
  totalRevenue: number;
  onlineMikrotiks: number;
  totalMikrotiks: number;
  systemHealth: 'good' | 'warning' | 'critical';
  newSignups: number;
}

const mockStats: DashboardStats = {
  totalGyms: 127,
  activeGyms: 98,
  totalMembers: 45832,
  totalRevenue: 892450,
  onlineMikrotiks: 245,
  totalMikrotiks: 267,
  systemHealth: 'good',
  newSignups: 234
};

interface RecentActivity {
  id: string;
  type: 'gym_register' | 'mikrotik_offline' | 'payment' | 'new_member';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'gym_register',
    message: 'Nuevo gimnasio "FitLife Center" se ha registrado',
    timestamp: 'Hace 5 minutos',
    status: 'success'
  },
  {
    id: '2',
    type: 'mikrotik_offline',
    message: 'Dispositivo MT-Router-045 se ha desconectado',
    timestamp: 'Hace 12 minutos',
    status: 'error'
  },
  {
    id: '3',
    type: 'payment',
    message: 'Pago recibido de PowerFit Gym - $2,450',
    timestamp: 'Hace 25 minutos',
    status: 'success'
  },
  {
    id: '4',
    type: 'new_member',
    message: '127 nuevos miembros registrados hoy',
    timestamp: 'Hace 1 hora',
    status: 'success'
  }
];

interface TopGym {
  id: string;
  name: string;
  members: number;
  revenue: number;
  growth: number;
}

const mockTopGyms: TopGym[] = [
  {
    id: '1',
    name: 'PowerFit Gym',
    members: 892,
    revenue: 89200,
    growth: 12.5
  },
  {
    id: '2',
    name: 'Elite Fitness',
    members: 756,
    revenue: 75600,
    growth: 8.3
  },
  {
    id: '3',
    name: 'FitZone Center',
    members: 623,
    revenue: 62300,
    growth: -2.1
  }
];

const DashboardSuperAdmin: React.FC = () => {
  const stats = mockStats;
  const recentActivity = mockRecentActivity;
  const topGyms = mockTopGyms;

  const getSystemHealthColor = (health: DashboardStats['systemHealth']) => {
    switch (health) {
      case 'good':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSystemHealthText = (health: DashboardStats['systemHealth']) => {
    switch (health) {
      case 'good':
        return 'Sistema saludable';
      case 'warning':
        return 'Advertencias del sistema';
      case 'critical':
        return 'Problemas críticos';
      default:
        return 'Estado desconocido';
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'gym_register':
        return <Building2 className="w-4 h-4" />;
      case 'mikrotik_offline':
        return <WifiOff className="w-4 h-4" />;
      case 'payment':
        return <CreditCard className="w-4 h-4" />;
      case 'new_member':
        return <UserPlus className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard SuperAdmin</h1>
          <p className="text-gray-600 dark:text-gray-400">Vista general de toda la plataforma EntrenaTech</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getSystemHealthColor(stats.systemHealth)}`}>
            <Activity className="w-3 h-3 mr-1" />
            {getSystemHealthText(stats.systemHealth)}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Gimnasios</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalGyms}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {stats.activeGyms} activos
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Miembros</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalMembers.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                +{stats.newSignups} hoy
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ${stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                +12.5% este mes
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dispositivos Red</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalMikrotiks}</p>
              <p className={`text-xs mt-1 ${
                stats.onlineMikrotiks === stats.totalMikrotiks
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-yellow-600 dark:text-yellow-400'
              }`}>
                {stats.onlineMikrotiks} en línea
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Router className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getActivityColor(activity.status)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Estado del Sistema</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Servidores</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">Operativos</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Conectividad</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">Estable</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Pagos</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">Procesando</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Rendimiento</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">Óptimo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Gyms */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gimnasios Top</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Gimnasio</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Miembros</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Ingresos</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Crecimiento</th>
              </tr>
            </thead>
            <tbody>
              {topGyms.map((gym) => (
                <tr key={gym.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">
                    <div className="font-medium text-gray-900 dark:text-white">{gym.name}</div>
                  </td>
                  <td className="py-3">
                    <div className="text-gray-900 dark:text-white">{gym.members.toLocaleString()}</div>
                  </td>
                  <td className="py-3">
                    <div className="text-gray-900 dark:text-white">${gym.revenue.toLocaleString()}</div>
                  </td>
                  <td className="py-3">
                    <div className={`text-sm font-medium ${
                      gym.growth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {gym.growth > 0 ? '+' : ''}{gym.growth}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardSuperAdmin;