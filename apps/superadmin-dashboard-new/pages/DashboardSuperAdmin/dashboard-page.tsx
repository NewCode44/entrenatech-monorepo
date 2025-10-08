import React from 'react';
import {
  Building2,
  Users,
  DollarSign,
  Router,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { mockDashboardStats, mockGyms, mockMikrotiks } from '@/services/mock-data';

const DashboardPage: React.FC = () => {
  const stats = mockDashboardStats;
  const recentGyms = mockGyms.slice(0, 3);
  const criticalMikrotiks = mockMikrotiks.filter(m => m.status === 'offline');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Vista general de toda la plataforma</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Activity className="w-3 h-3 mr-1" />
            Sistema operativo
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
                +{stats.newGymsThisMonth} este mes
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Miembros Totales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalMembers.toLocaleString()}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {stats.activeGyms} gimnasios activos
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ingresos Mensuales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                +{stats.revenueGrowth}% crecimiento
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mikrotiks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.mikrotiksOnline}/{stats.mikrotiksOnline + stats.mikrotiksOffline}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                {stats.mikrotiksOffline} fuera de línea
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Router className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Gyms */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Gimnasios Recientes</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentGyms.map((gym) => (
              <div key={gym.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{gym.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{gym.owner} • {gym.membersCount} miembros</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    gym.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : gym.status === 'trial'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {gym.status === 'active' ? 'Activo' : gym.status === 'trial' ? 'Prueba' : 'Suspendido'}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">${gym.monthlyRevenue}/mes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Alertas del Sistema</h2>
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            {criticalMikrotiks.length > 0 ? (
              criticalMikrotiks.map((mikrotik) => (
                <div key={mikrotik.id} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-red-900 dark:text-red-200">
                      Mikrotik {mikrotik.name} está fuera de línea
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      IP: {mikrotik.ipAddress} • Última conexión: Desconocido
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-green-900 dark:text-green-200">
                    Todos los sistemas operativos
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    No hay alertas críticas en este momento
                  </p>
                </div>
              </div>
            )}

            {/* Additional System Info */}
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <Activity className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-blue-900 dark:text-blue-200">
                  Rendimiento del sistema
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  CPU: 12% • Memoria: 45% • Disco: 62%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { DashboardPage };