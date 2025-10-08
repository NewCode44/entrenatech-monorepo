import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Router,
  Building2,
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Settings,
  RefreshCw,
  Power,
  Edit,
  AlertTriangle,
  CheckCircle,
  Copy,
  Terminal,
  Network
} from 'lucide-react';
import { mockMikrotiks, mockGyms } from '@/services/mock-data';

const MikrotikDetailPage: React.FC = () => {
  const { mikrotikId } = useParams<{ mikrotikId: string }>();
  const [isRebooting, setIsRebooting] = useState(false);

  const mikrotik = mockMikrotiks.find(m => m.id === mikrotikId);
  const gym = mockGyms.find(g => g.id === mikrotik?.gymId);

  if (!mikrotik) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mikrotik no encontrado</h2>
        <Link
          to="/mikrotiks"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Mikrotiks
        </Link>
      </div>
    );
  }

  const handleReboot = async () => {
    setIsRebooting(true);
    // Simulate reboot process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRebooting(false);
  };

  const getStatusColor = (status: string) => {
    return status === 'online' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusText = (status: string) => {
    return status === 'online' ? 'En línea' : 'Fuera de línea';
  };

  const getCpuLoadColor = (load: number) => {
    if (load >= 80) return 'text-red-600';
    if (load >= 60) return 'text-orange-600';
    if (load >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getMemoryUsageColor = (usage: number) => {
    if (usage >= 80) return 'text-red-600';
    if (usage >= 60) return 'text-orange-600';
    if (usage >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/mikrotiks"
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{mikrotik.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">Detalles del dispositivo Mikrotik</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Edit className="w-4 h-4" />
            Editar Configuración
          </button>
          <button
            onClick={handleReboot}
            disabled={isRebooting || mikrotik.status !== 'online'}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isRebooting ? 'animate-spin' : ''}`} />
            {isRebooting ? 'Reiniciando...' : 'Reiniciar'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Terminal className="w-4 h-4" />
            Consola
          </button>
        </div>
      </div>

      {/* Status and Basic Info */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className={`w-2 h-2 rounded-full ${mikrotik.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-sm font-medium ${getStatusColor(mikrotik.status)}`}>
            {getStatusText(mikrotik.status)}
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Building2 className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {gym?.name || 'Gimnasio desconocido'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Device Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información del Dispositivo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Nombre del Router</label>
                <div className="flex items-center gap-2 mt-1">
                  <Router className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900 dark:text-white">{mikrotik.name}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Dirección IP</label>
                <div className="flex items-center gap-2 mt-1">
                  <Network className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900 dark:text-white font-mono">{mikrotik.ipAddress}</p>
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Versión</label>
                <p className="text-gray-900 dark:text-white mt-1">{mikrotik.version}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Tiempo Activo</label>
                <div className="flex items-center gap-2 mt-1">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900 dark:text-white">{mikrotik.uptime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Métricas de Rendimiento</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Uso de CPU</span>
                  </div>
                  <span className={`text-sm font-bold ${getCpuLoadColor(mikrotik.cpuLoad)}`}>
                    {mikrotik.cpuLoad}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      mikrotik.cpuLoad >= 80 ? 'bg-red-500' :
                      mikrotik.cpuLoad >= 60 ? 'bg-orange-500' :
                      mikrotik.cpuLoad >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${mikrotik.cpuLoad}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Uso de Memoria</span>
                  </div>
                  <span className={`text-sm font-bold ${getMemoryUsageColor(mikrotik.memoryUsage)}`}>
                    {mikrotik.memoryUsage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      mikrotik.memoryUsage >= 80 ? 'bg-red-500' :
                      mikrotik.memoryUsage >= 60 ? 'bg-orange-500' :
                      mikrotik.memoryUsage >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${mikrotik.memoryUsage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Dispositivos Conectados</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">
                    {mikrotik.connectedDevices}
                  </span>
                </div>
                <div className="grid grid-cols-10 gap-1">
                  {Array.from({ length: 50 }, (_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full ${
                        i < Math.min(mikrotik.connectedDevices / 2, 50)
                          ? 'bg-blue-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Network Interfaces */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interfaces de Red</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">ether1</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">WAN - 190.104.15.22/24</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 dark:text-white">100 Mbps</p>
                  <p className="text-xs text-green-600">Activo</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">bridge-local</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">LAN - 192.168.1.1/24</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 dark:text-white">1 Gbps</p>
                  <p className="text-xs text-green-600">Activo</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">wlan1</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">WiFi - 192.168.88.1/24</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 dark:text-white">300 Mbps</p>
                  <p className="text-xs text-blue-600">Activo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Estado del Sistema</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Conexión</span>
                <div className="flex items-center gap-1">
                  {mikrotik.status === 'online' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${getStatusColor(mikrotik.status)}`}>
                    {getStatusText(mikrotik.status)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Última actualización</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Ahora</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Temperatura</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">42°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Voltaje</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">12.1V</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <button className="flex items-center gap-3 w-full p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Terminal className="w-4 h-4" />
                <span>Abrir Consola</span>
              </button>
              <button className="flex items-center gap-3 w-full p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Network className="w-4 h-4" />
                <span>Ver Tráfico</span>
              </button>
              <button className="flex items-center gap-3 w-full p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                <span>Configurar Red</span>
              </button>
              <button className="flex items-center gap-3 w-full p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Power className="w-4 h-4" />
                <span>Apagar</span>
              </button>
            </div>
          </div>

          {/* Alerts */}
          {mikrotik.status === 'offline' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 dark:text-red-200">Dispositivo Fuera de Línea</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    El Mikrotik no responde. Verifique la conexión y el estado del dispositivo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { MikrotikDetailPage };