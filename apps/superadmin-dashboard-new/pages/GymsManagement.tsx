import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
  RefreshCw,
  X
} from 'lucide-react';
import { apiService } from '@/services/api';

interface Gym {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  members: number;
  status: 'active' | 'trial' | 'suspended';
  revenue: number;
  joinDate: string;
  lastActive: string;
  plan: 'basic' | 'premium' | 'enterprise';
}

const mockGyms: Gym[] = [
  {
    id: '1',
    name: 'PowerFit Gym',
    owner: 'Carlos Rodríguez',
    email: 'carlos@powerfit.com',
    phone: '+52 555-123-4567',
    members: 245,
    status: 'active',
    revenue: 24500,
    joinDate: '2024-01-15',
    lastActive: '2024-10-06',
    plan: 'premium'
  },
  {
    id: '2',
    name: 'FitZone Center',
    owner: 'María González',
    email: 'maria@fitzone.com',
    phone: '+52 555-987-6543',
    members: 189,
    status: 'active',
    revenue: 18900,
    joinDate: '2024-02-20',
    lastActive: '2024-10-07',
    plan: 'basic'
  },
  {
    id: '3',
    name: 'Elite Fitness',
    owner: 'Roberto Martínez',
    email: 'roberto@elitefitness.com',
    phone: '+52 555-456-7890',
    members: 412,
    status: 'trial',
    revenue: 0,
    joinDate: '2024-09-01',
    lastActive: '2024-10-05',
    plan: 'premium'
  }
];

const GymsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [gyms, setGyms] = useState(mockGyms);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Load gyms from API
  const loadGyms = async (page = 1, append = false) => {
    try {
      if (!append) setLoading(true);

      const response = await apiService.getGyms({
        page,
        limit: pagination.limit,
        search: searchTerm,
        status: statusFilter === 'all' ? '' : statusFilter,
        sortBy: 'created_at',
        sortOrder: 'DESC',
      });

      if (response.success && response.data) {
        const newGyms = response.data.map((gym: any) => ({
          id: gym.id,
          name: gym.name,
          owner: gym.owner_name,
          email: gym.email,
          phone: gym.phone,
          members: gym.active_members || 0,
          status: gym.status,
          revenue: gym.total_revenue || 0,
          joinDate: new Date(gym.created_at).toLocaleDateString(),
          lastActive: new Date(gym.updated_at).toLocaleDateString(),
          plan: gym.plan,
        }));

        setGyms(prev => append ? [...prev, ...newGyms] : newGyms);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to load gyms:', error);
      showNotification('error', 'Failed to load gyms');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadGyms(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter]);

  // Initial load
  useEffect(() => {
    loadGyms();
  }, []);

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle delete gym
  const handleDeleteGym = async (gymId: string) => {
    if (!confirm('Are you sure you want to delete this gym? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await apiService.deleteGym(gymId);
      if (response.success) {
        setGyms(gyms.filter(gym => gym.id !== gymId));
        showNotification('success', 'Gym deleted successfully');
      } else {
        showNotification('error', response.message || 'Failed to delete gym');
      }
    } catch (error) {
      console.error('Failed to delete gym:', error);
      showNotification('error', 'Failed to delete gym');
    }
  };

  // Handle suspend/activate gym
  const handleToggleGymStatus = async (gymId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';

    try {
      const response = await apiService.updateGym(gymId, { status: newStatus });
      if (response.success) {
        setGyms(gyms.map(gym =>
          gym.id === gymId ? { ...gym, status: newStatus as Gym['status'] } : gym
        ));
        showNotification('success', `Gym ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
      } else {
        showNotification('error', response.message || 'Failed to update gym status');
      }
    } catch (error) {
      console.error('Failed to update gym status:', error);
      showNotification('error', 'Failed to update gym status');
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    loadGyms(page);
  };

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
        return 'Desconocido';
    }
  };

  const getPlanColor = (plan: Gym['plan']) => {
    switch (plan) {
      case 'basic':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'premium':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'enterprise':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPlanText = (plan: Gym['plan']) => {
    switch (plan) {
      case 'basic':
        return 'Básico';
      case 'premium':
        return 'Premium';
      case 'enterprise':
        return 'Enterprise';
      default:
        return 'Desconocido';
    }
  };

  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Gimnasios</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Administra todos los gimnasios de la plataforma</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Gimnasio
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-lg ${
          notification.type === 'success'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Gimnasios</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{gyms.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gimnasios Activos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {gyms.filter(g => g.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Miembros</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {gyms.reduce((sum, gym) => sum + gym.members, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                ${gyms.reduce((sum, gym) => sum + gym.revenue, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar gimnasios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="trial">Prueba</option>
            <option value="suspended">Suspendidos</option>
          </select>
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
                  Miembros
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ingresos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Última Actividad
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredGyms.map((gym) => (
                <tr key={gym.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {gym.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {gym.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {gym.owner}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {gym.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {gym.members.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(gym.status)}`}>
                      {getStatusText(gym.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(gym.plan)}`}>
                      {getPlanText(gym.plan)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      ${gym.revenue.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {gym.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleGymStatus(gym.id, gym.status)}
                        className={`${
                          gym.status === 'active'
                            ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300'
                            : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                        }`}
                        title={gym.status === 'active' ? 'Suspend gym' : 'Activate gym'}
                      >
                        {gym.status === 'active' ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteGym(gym.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete gym"
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

      {/* Add Gym Modal - Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Nuevo Gimnasio
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Funcionalidad de agregar gimnasio en desarrollo...
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GymsManagement;