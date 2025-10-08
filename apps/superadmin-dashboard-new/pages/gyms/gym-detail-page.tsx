import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Users,
  DollarSign,
  Mail,
  Calendar,
  Router,
  Activity,
  Shield,
  Edit,
  Settings,
  BarChart3,
  UserCheck
} from 'lucide-react';
import { mockGyms, mockMikrotiks } from '@/services/mock-data';
import { Gym, Mikrotik } from '@/types';

const GymDetailPage: React.FC = () => {
  const { gymId } = useParams<{ gymId: string }>();

  const gym = mockGyms.find(g => g.id === gymId);
  const mikrotik = mockMikrotiks.find(m => m.gymId === gymId);

  if (!gym) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Gimnasio no encontrado</h2>
        <Link
          to="/gyms"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a gimnasios
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: Gym['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'trial':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: Gym['status']) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'trial':
        return 'Prueba';
      case 'suspended':
        return 'Suspendido';
      default:
        return status;
    }
  };

  const getTierColor = (tier: Gym['subscriptionTier']) => {
    switch (tier) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'premium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'basic':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTierText = (tier: Gym['subscriptionTier']) => {
    switch (tier) {
      case 'enterprise':
        return 'Enterprise';
      case 'premium':
        return 'Premium';
      case 'basic':
        return 'Básico';
      default:
        return tier;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/gyms"
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{gym.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">Detalles del gimnasio</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Edit className="w-4 h-4" />
            Editar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Settings className="w-4 h-4" />
            Configurar
          </button>
        </div>
      </div>

      {/* Status and Plan */}
      <div className="flex flex-wrap gap-3">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(gym.status)}`}>
          <Shield className="w-4 h-4 mr-1" />
          {getStatusText(gym.status)}
        </span>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTierColor(gym.subscriptionTier)}`}>
          <DollarSign className="w-4 h-4 mr-1" />
          {getTierText(gym.subscriptionTier)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gym Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información del Gimnasio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Propietario</label>
                <div className="flex items-center gap-2 mt-1">
                  <UserCheck className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900 dark:text-white">{gym.owner}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900 dark:text-white">{gym.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Fecha de creación</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900 dark:text-white">{gym.createdAt}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Último acceso</label>
                <div className="flex items-center gap-2 mt-1">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900 dark:text-white">
                    {gym.lastLogin ? new Date(gym.lastLogin).toLocaleDateString() : 'Nunca'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mikrotik Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información del Mikrotik</h2>
            {mikrotik ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Nombre del router</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Router className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900 dark:text-white">{mikrotik.name}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Dirección IP</label>
                  <p className="text-gray-900 dark:text-white font-mono mt-1">{mikrotik.ipAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Estado</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${mikrotik.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <p className={`text-gray-900 dark:text-white capitalize ${mikrotik.status === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                      {mikrotik.status === 'online' ? 'En línea' : 'Fuera de línea'}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Versión</label>
                  <p className="text-gray-900 dark:text-white mt-1">{mikrotik.version}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Tiempo activo</label>
                  <p className="text-gray-900 dark:text-white mt-1">{mikrotik.uptime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Dispositivos conectados</label>
                  <p className="text-gray-900 dark:text-white mt-1">{mikrotik.connectedDevices}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Uso de CPU</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${mikrotik.cpuLoad}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">{mikrotik.cpuLoad}%</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Uso de memoria</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${mikrotik.memoryUsage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">{mikrotik.memoryUsage}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Router className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No hay Mikrotik configurado para este gimnasio</p>
                <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Configurar Mikrotik
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Estadísticas Rápidas</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Miembros</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{gym.membersCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ingresos mensuales</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">${gym.monthlyRevenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Router className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">IP Mikrotik</span>
                </div>
                <span className="text-sm font-mono text-gray-900 dark:text-white">{gym.mikrotikIp}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <Link
                to={`/gyms/${gymId}/analytics`}
                className="flex items-center gap-3 w-full p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Ver analíticas</span>
              </Link>
              <Link
                to={`/gyms/${gymId}/members`}
                className="flex items-center gap-3 w-full p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>Gestionar miembros</span>
              </Link>
              <Link
                to={`/mikrotiks/${mikrotik?.id}`}
                className="flex items-center gap-3 w-full p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Router className="w-4 h-4" />
                <span>Configurar Mikrotik</span>
              </Link>
              <button className="flex items-center gap-3 w-full p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                <span>Configuración avanzada</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { GymDetailPage };