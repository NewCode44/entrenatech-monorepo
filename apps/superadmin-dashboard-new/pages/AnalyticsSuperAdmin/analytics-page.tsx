import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  Building2,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { mockGyms, mockMikrotiks } from '@/services/mock-data';

const AnalyticsPage: React.FC = () => {
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Mock data for charts
  const revenueData = [
    { month: 'Ene', revenue: 12500, gyms: 12 },
    { month: 'Feb', revenue: 14200, gyms: 14 },
    { month: 'Mar', revenue: 15800, gyms: 15 },
    { month: 'Abr', revenue: 16900, gyms: 16 },
    { month: 'May', revenue: 18700, gyms: 18 },
    { month: 'Jun', revenue: 21300, gyms: 20 },
  ];

  const membershipData = [
    { name: 'Básico', value: 450, color: '#8B5CF6' },
    { name: 'Premium', value: 320, color: '#3B82F6' },
    { name: 'Enterprise', value: 180, color: '#10B981' },
  ];

  const statusData = [
    { status: 'Activos', count: mockGyms.filter(g => g.status === 'active').length, color: '#10B981' },
    { status: 'Prueba', count: mockGyms.filter(g => g.status === 'trial').length, color: '#3B82F6' },
    { status: 'Suspendidos', count: mockGyms.filter(g => g.status === 'suspended').length, color: '#EF4444' },
  ];

  const performanceData = [
    { metric: 'CPU Online', value: 85 },
    { metric: 'Memoria Online', value: 78 },
    { metric: 'Dispositivos Conectados', value: 92 },
    { metric: 'Uptime Promedio', value: 88 },
  ];

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalMembers = mockGyms.reduce((sum, gym) => sum + gym.membersCount, 0);
  const avgRevenuePerGym = Math.round(totalRevenue / mockGyms.length);
  const onlineMikrotiks = mockMikrotiks.filter(m => m.status === 'online').length;

  const handleExportReport = () => {
    setNotification({
      type: 'success',
      message: 'Generando reporte...'
    });

    // Simulate report generation
    setTimeout(() => {
      // Create CSV content
      const csvContent = [
        ['Métrica', 'Valor', 'Cambio'],
        ['Ingresos Totales', `$${totalRevenue.toLocaleString()}`, '+12.5%'],
        ['Miembros Totales', totalMembers.toLocaleString(), '+8.3%'],
        ['Gimnasios Activos', mockGyms.filter(g => g.status === 'active').length, '+25.0%'],
        ['Mikrotiks Online', `${onlineMikrotiks}/${mockMikrotiks.length}`, '0.0%'],
        ['Promedio por Gimnasio', `$${avgRevenuePerGym.toLocaleString()}`, '+5.2%']
      ].map(row => row.join(',')).join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `entrenatech-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setNotification({
        type: 'success',
        message: 'Reporte exportado exitosamente'
      });

      setTimeout(() => setNotification(null), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analíticas</h1>
          <p className="text-gray-600 dark:text-gray-400">Métricas y rendimiento de toda la plataforma</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Calendar className="w-4 h-4" />
            Últimos 6 meses
          </button>
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar Reporte
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5% vs período anterior
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Miembros Totales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalMembers.toLocaleString()}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center">
                <Users className="w-3 h-3 mr-1" />
                +8.3% crecimiento
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Promedio por Gimnasio</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${avgRevenuePerGym.toLocaleString()}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 flex items-center">
                <BarChart3 className="w-3 h-3 mr-1" />
                Por mes
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mikrotiks Online</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{onlineMikrotiks}/{mockMikrotiks.length}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                {Math.round((onlineMikrotiks / mockMikrotiks.length) * 100)}% uptime
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tendencia de Ingresos</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
                itemStyle={{ color: '#F3F4F6' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8B5CF6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Membership Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Distribución de Membresías</h2>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={membershipData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {membershipData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
                itemStyle={{ color: '#F3F4F6' }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Gym Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Estado de Gimnasios</h2>
            <Building2 className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="status" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
                itemStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Métricas de Rendimiento</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {performanceData.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.metric}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      item.value >= 90 ? 'bg-green-500' :
                      item.value >= 70 ? 'bg-blue-500' :
                      item.value >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Estadísticas Detalladas</h2>
          <Download className="w-5 h-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Métrica
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Mes Anterior
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cambio
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Ingresos Totales
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${totalRevenue.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  $18,950
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                  +12.5%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Total Miembros
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {totalMembers.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  847
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                  +8.3%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Gimnasios Activos
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {mockGyms.filter(g => g.status === 'active').length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  3
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                  +25.0%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Mikrotiks Online
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {onlineMikrotiks}/{mockMikrotiks.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  3/5
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 dark:text-yellow-400">
                  0.0%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border flex items-center gap-3 max-w-sm ${
          notification.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          )}
          <p className={`text-sm font-medium ${
            notification.type === 'success'
              ? 'text-green-900 dark:text-green-200'
              : 'text-red-900 dark:text-red-200'
          }`}>
            {notification.message}
          </p>
        </div>
      )}
    </div>
  );
};

export { AnalyticsPage };