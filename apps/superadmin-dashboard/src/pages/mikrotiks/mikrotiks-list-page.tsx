import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Router,
  Building2,
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { mockMikrotiks, mockGyms } from '@/services/mock-data';
import { Mikrotik } from '@/types';
import { AddMikrotikModal } from '@/components/mikrotiks/add-mikrotik-modal';

const MikrotiksListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [mikrotiks, setMikrotiks] = useState(mockMikrotiks);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredMikrotiks = mikrotiks.filter(mikrotik => {
    const matchesSearch = mikrotik.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mikrotik.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || mikrotik.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getGymName = (gymId: string) => {
    const gym = mockGyms.find(g => g.id === gymId);
    return gym?.name || 'Gimnasio desconocido';
  };

  const getStatusColor = (status: Mikrotik['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'offline':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: Mikrotik['status']) => {
    switch (status) {
      case 'online':
        return 'En línea';
      case 'offline':
        return 'Fuera de línea';
      default:
        return status;
    }
  };

  const getCpuLoadColor = (load: number) => {
    if (load >= 80) return 'text-red-600 dark:text-red-400';
    if (load >= 60) return 'text-orange-600 dark:text-orange-400';
    if (load >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getMemoryUsageColor = (usage: number) => {
    if (usage >= 80) return 'text-red-600 dark:text-red-400';
    if (usage >= 60) return 'text-orange-600 dark:text-orange-400';
    if (usage >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const handleAddMikrotik = (newMikrotikData: Omit<Mikrotik, 'id'>) => {
    const newMikrotik: Mikrotik = {
      ...newMikrotikData,
      id: (mikrotiks.length + 1).toString()
    };

    setMikrotiks(prev => [...prev, newMikrotik]);
    setNotification({
      type: 'success',
      message: `Mikrotik "${newMikrotik.name}" agregado exitosamente`
    });

    setTimeout(() => setNotification(null), 3000);
  };

  const handleRebootMikrotik = (mikrotikId: string, mikrotikName: string) => {
    if (confirm(`¿Estás seguro de que deseas reiniciar el Mikrotik "${mikrotikName}"?`)) {
      setNotification({
        type: 'success',
        message: `Reiniciando Mikrotik "${mikrotikName}"...`
      });

      setTimeout(() => {
        setMikrotiks(prev => prev.map(m =>
          m.id === mikrotikId
            ? { ...m, status: 'offline', uptime: '0d 0h 0m', cpuLoad: 0, memoryUsage: 0 }
            : m
        ));
        setNotification({
          type: 'success',
          message: `Mikrotik "${mikrotikName}" reiniciado exitosamente`
        });
        setTimeout(() => setNotification(null), 3000);
      }, 2000);
    }
  };

  const handleEditMikrotik = (mikrotikId: string) => {
    setNotification({
      type: 'error',
      message: 'Función de edición próximamente disponible'
    });

    setTimeout(() => setNotification(null), 3000);
  };

  const handleRefreshMikrotiks = () => {
    setNotification({
      type: 'success',
      message: 'Actualizando estado de Mikrotiks...'
    });

    setTimeout(() => {
      setNotification({
        type: 'success',
        message: 'Estado de Mikrotiks actualizado'
      });
      setTimeout(() => setNotification(null), 2000);
    }, 1500);
  };

  const onlineCount = mikrotiks.filter(m => m.status === 'online').length;
  const offlineCount = mikrotiks.filter(m => m.status === 'offline').length;
  const totalDevices = mikrotiks.reduce((sum, m) => sum + m.connectedDevices, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mikrotiks</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitorea y gestiona todos los dispositivos Mikrotik</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshMikrotiks}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Mikrotik
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar Mikrotiks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">Todos los estados</option>
          <option value="online">En línea</option>
          <option value="offline">Fuera de línea</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{mikrotiks.length}</p>
            </div>
            <Router className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En línea</p>
              <p className="text-2xl font-bold text-green-600">{onlineCount}</p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fuera de línea</p>
              <p className="text-2xl font-bold text-red-600">{offlineCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dispositivos</p>
              <p className="text-2xl font-bold text-blue-600">{totalDevices.toLocaleString()}</p>
            </div>
            <Wifi className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Mikrotiks Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Mikrotik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Gimnasio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tiempo Activo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  CPU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Memoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Dispositivos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMikrotiks.map((mikrotik) => (
                <tr key={mikrotik.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <Link
                        to={`/mikrotiks/${mikrotik.id}`}
                        className="text-sm font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400"
                      >
                        {mikrotik.name}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{mikrotik.ipAddress}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{mikrotik.version}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <Building2 className="w-4 h-4 mr-1 text-gray-400" />
                      {getGymName(mikrotik.gymId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${mikrotik.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(mikrotik.status)}`}>
                        {getStatusText(mikrotik.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <Activity className="w-4 h-4 mr-1 text-gray-400" />
                      {mikrotik.uptime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm font-medium ${getCpuLoadColor(mikrotik.cpuLoad)}`}>
                        {mikrotik.cpuLoad}%
                      </span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${mikrotik.cpuLoad >= 80 ? 'bg-red-500' : mikrotik.cpuLoad >= 60 ? 'bg-orange-500' : mikrotik.cpuLoad >= 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${mikrotik.cpuLoad}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm font-medium ${getMemoryUsageColor(mikrotik.memoryUsage)}`}>
                        {mikrotik.memoryUsage}%
                      </span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${mikrotik.memoryUsage >= 80 ? 'bg-red-500' : mikrotik.memoryUsage >= 60 ? 'bg-orange-500' : mikrotik.memoryUsage >= 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${mikrotik.memoryUsage}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <Wifi className="w-4 h-4 mr-1 text-gray-400" />
                      {mikrotik.connectedDevices}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/mikrotiks/${mikrotik.id}`}
                        className="p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleEditMikrotik(mikrotik.id)}
                        className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Configurar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRebootMikrotik(mikrotik.id, mikrotik.name)}
                        className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        title="Reiniciar"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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

      {/* Add Mikrotik Modal */}
      <AddMikrotikModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddMikrotik={handleAddMikrotik}
        gyms={mockGyms.map(gym => ({ id: gym.id, name: gym.name }))}
      />
    </div>
  );
};

export { MikrotiksListPage };