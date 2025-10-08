import React, { useState } from 'react';
import {
  Router,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Settings,
  Activity,
  Clock,
  MapPin
} from 'lucide-react';

interface Mikrotik {
  id: string;
  name: string;
  ip: string;
  model: string;
  firmware: string;
  location: string;
  status: 'online' | 'offline' | 'warning';
  uptime: string;
  cpu: number;
  memory: number;
  temperature: number;
  connectedClients: number;
  lastSeen: string;
  gymName: string;
}

const mockMikrotiks: Mikrotik[] = [
  {
    id: '1',
    name: 'MT-Router-01',
    ip: '192.168.1.1',
    model: 'RB4011iGS+',
    firmware: '7.12',
    location: 'PowerFit Gym - Sala Principal',
    status: 'online',
    uptime: '45 días',
    cpu: 15,
    memory: 32,
    temperature: 42,
    connectedClients: 45,
    lastSeen: '2024-10-07 15:30:00',
    gymName: 'PowerFit Gym'
  },
  {
    id: '2',
    name: 'MT-Router-02',
    ip: '192.168.1.2',
    model: 'RB750Gr3',
    firmware: '7.11',
    location: 'FitZone Center - Recepción',
    status: 'offline',
    uptime: '0 días',
    cpu: 0,
    memory: 0,
    temperature: 0,
    connectedClients: 0,
    lastSeen: '2024-10-07 14:15:00',
    gymName: 'FitZone Center'
  },
  {
    id: '3',
    name: 'MT-Router-03',
    ip: '192.168.1.3',
    model: 'RB2011UiAS',
    firmware: '7.12',
    location: 'Elite Fitness - Área de Pesas',
    status: 'warning',
    uptime: '12 días',
    cpu: 85,
    memory: 78,
    temperature: 68,
    connectedClients: 32,
    lastSeen: '2024-10-07 15:25:00',
    gymName: 'Elite Fitness'
  }
];

const MikrotiksManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [mikrotiks, setMikrotiks] = useState(mockMikrotiks);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredMikrotiks = mikrotiks.filter(mikrotik => {
    const matchesSearch = mikrotik.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mikrotik.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mikrotik.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mikrotik.gymName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || mikrotik.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Mikrotik['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'offline':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: Mikrotik['status']) => {
    switch (status) {
      case 'online':
        return 'En línea';
      case 'offline':
        return 'Desconectado';
      case 'warning':
        return 'Advertencia';
      default:
        return 'Desconocido';
    }
  };

  const getStatusIcon = (status: Mikrotik['status']) => {
    switch (status) {
      case 'online':
        return <Wifi className="w-4 h-4" />;
      case 'offline':
        return <WifiOff className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getCpuColor = (cpu: number) => {
    if (cpu < 50) return 'text-green-600 dark:text-green-400';
    if (cpu < 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMemoryColor = (memory: number) => {
    if (memory < 50) return 'text-green-600 dark:text-green-400';
    if (memory < 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 50) return 'text-green-600 dark:text-green-400';
    if (temp < 65) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleRestartMikrotik = (mikrotikId: string) => {
    setNotification({
      type: 'success',
      message: `Dispositivo ${mikrotiks.find(m => m.id === mikrotikId)?.name} reiniciado correctamente`
    });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Mikrotiks</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Monitorea y administra los equipos de red</p>
        </div>
        <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Mikrotik
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Dispositivos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{mikrotiks.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Router className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En Línea</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {mikrotiks.filter(m => m.status === 'online').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Clientes Conectados</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {mikrotiks.reduce((sum, m) => sum + m.connectedClients, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Wifi className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Advertencias</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {mikrotiks.filter(m => m.status === 'warning').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
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
              placeholder="Buscar dispositivos..."
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
            <option value="online">En línea</option>
            <option value="offline">Desconectados</option>
            <option value="warning">Advertencia</option>
          </select>
        </div>
      </div>

      {/* Mikrotiks Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Dispositivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rendimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tiempo Activo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Clientes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMikrotiks.map((mikrotik) => (
                <tr key={mikrotik.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {mikrotik.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {mikrotik.ip} • {mikrotik.model}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {mikrotik.gymName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div className="text-sm text-gray-900 dark:text-white">
                        {mikrotik.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(mikrotik.status)}`}>
                      {getStatusIcon(mikrotik.status)}
                      {getStatusText(mikrotik.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">CPU:</span>
                        <span className={`text-sm font-medium ${getCpuColor(mikrotik.cpu)}`}>
                          {mikrotik.cpu}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">RAM:</span>
                        <span className={`text-sm font-medium ${getMemoryColor(mikrotik.memory)}`}>
                          {mikrotik.memory}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Temp:</span>
                        <span className={`text-sm font-medium ${getTemperatureColor(mikrotik.temperature)}`}>
                          {mikrotik.temperature}°C
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div className="text-sm text-gray-900 dark:text-white">
                        {mikrotik.uptime}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {mikrotik.connectedClients}
                    </div>
                    {mikrotik.status === 'offline' && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Último: {mikrotik.lastSeen}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRestartMikrotik(mikrotik.id)}
                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                        title="Reiniciar dispositivo"
                      >
                        <Activity className="w-4 h-4" />
                      </button>
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

export default MikrotiksManagement;