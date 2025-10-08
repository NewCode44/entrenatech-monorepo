import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  DollarSign,
  MoreHorizontal,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Shield,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { mockGyms } from '@/services/mock-data';
import { Gym } from '@/types';
import { AddGymModal } from '@/components/gyms/add-gym-modal';

const GymsListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [gyms, setGyms] = useState(mockGyms);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredGyms = gyms.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gym.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gym.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || gym.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        return 'text-purple-600 dark:text-purple-400';
      case 'premium':
        return 'text-blue-600 dark:text-blue-400';
      case 'basic':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
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

  const handleAddGym = (newGymData: Omit<Gym, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newGym: Gym = {
      ...newGymData,
      id: (gyms.length + 1).toString(),
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString()
    };

    setGyms(prev => [...prev, newGym]);
    setNotification({
      type: 'success',
      message: `Gimnasio "${newGym.name}" creado exitosamente`
    });

    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteGym = (gymId: string, gymName: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el gimnasio "${gymName}"?`)) {
      setGyms(prev => prev.filter(gym => gym.id !== gymId));
      setNotification({
        type: 'success',
        message: `Gimnasio "${gymName}" eliminado exitosamente`
      });

      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleEditGym = (gymId: string) => {
    setNotification({
      type: 'error',
      message: 'Función de edición próximamente disponible'
    });

    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gimnasios</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona todos los gimnasios de la plataforma</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Gimnasio
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar gimnasios..."
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
          <option value="active">Activos</option>
          <option value="trial">Prueba</option>
          <option value="suspended">Suspendidos</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{gyms.length}</p>
            </div>
            <Building2 className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Activos</p>
              <p className="text-2xl font-bold text-green-600">{gyms.filter(g => g.status === 'active').length}</p>
            </div>
            <Shield className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Prueba</p>
              <p className="text-2xl font-bold text-blue-600">{gyms.filter(g => g.status === 'trial').length}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Suspendidos</p>
              <p className="text-2xl font-bold text-red-600">{gyms.filter(g => g.status === 'suspended').length}</p>
            </div>
            <Building2 className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Gyms Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Gimnasio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Propietario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Miembros
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ingresos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Mikrotik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredGyms.map((gym) => (
                <tr key={gym.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <Link
                        to={`/gyms/${gym.id}`}
                        className="text-sm font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400"
                      >
                        {gym.name}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400">ID: {gym.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{gym.owner}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{gym.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(gym.status)}`}>
                      {getStatusText(gym.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getTierColor(gym.subscriptionTier)}`}>
                      {getTierText(gym.subscriptionTier)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <Users className="w-4 h-4 mr-1 text-gray-400" />
                      {gym.membersCount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                      ${gym.monthlyRevenue.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white font-mono">
                      {gym.mikrotikIp}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/gyms/${gym.id}`}
                        className="p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleEditGym(gym.id)}
                        className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGym(gym.id, gym.name)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
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

      {/* Add Gym Modal */}
      <AddGymModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddGym={handleAddGym}
      />
    </div>
  );
};

export { GymsListPage };