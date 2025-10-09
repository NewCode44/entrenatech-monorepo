import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  Activity,
  Server,
  Users,
  AlertTriangle,
  RefreshCw,
  Monitor,
  Cpu,
  HardDrive,
  Zap,
  Globe
} from 'lucide-react';

interface MikrotikDevice {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline';
  uptime?: string;
  cpuLoad?: number;
  memoryUsage?: number;
  diskUsage?: number;
  interfaces?: InterfaceTraffic[];
  wirelessClients?: WirelessClient[];
  alerts?: Alert[];
}

interface InterfaceTraffic {
  name: string;
  type: string;
  status: 'up' | 'down';
  rxBytes: number;
  txBytes: number;
  rxPacket: number;
  txPacket: number;
}

interface WirelessClient {
  macAddress: string;
  ipAddress: string;
  signalStrength: number;
  signalToNoise: number;
  uptime: string;
  txRate: string;
  rxRate: string;
}

interface Alert {
  type: string;
  severity: 'warning' | 'critical';
  message: string;
  value?: number;
  threshold?: number;
}

const MikrotikMonitor: React.FC = () => {
  const [devices, setDevices] = useState<MikrotikDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<MikrotikDevice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const loadDevices = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockDevices: MikrotikDevice[] = [
          {
            id: 'mikrotik-1',
            name: 'Router Principal',
            ip: '5.161.196.136',
            status: 'online',
            uptime: '10d15h30m',
            cpuLoad: 25,
            memoryUsage: 65,
            diskUsage: 45,
            interfaces: [
              {
                name: 'ether1',
                type: 'ether',
                status: 'up',
                rxBytes: 1024000,
                txBytes: 2048000,
                rxPacket: 1500,
                txPacket: 2300
              },
              {
                name: 'wlan1',
                type: 'wireless',
                status: 'up',
                rxBytes: 512000,
                txBytes: 1024000,
                rxPacket: 800,
                txPacket: 1200
              }
            ],
            wirelessClients: [
              {
                macAddress: '00:11:22:33:44:55',
                ipAddress: '192.168.1.100',
                signalStrength: -65,
                signalToNoise: 25,
                uptime: '2h15m',
                txRate: '130Mbps',
                rxRate: '130Mbps'
              },
              {
                macAddress: '66:77:88:99:AA:BB',
                ipAddress: '192.168.1.101',
                signalStrength: -72,
                signalToNoise: 18,
                uptime: '45m',
                txRate: '65Mbps',
                rxRate: '65Mbps'
              }
            ],
            alerts: []
          },
          {
            id: 'mikrotik-2',
            name: 'Access Point 1',
            ip: '192.168.1.2',
            status: 'offline',
            alerts: [
              {
                type: 'device_offline',
                severity: 'critical',
                message: 'Device is offline'
              }
            ]
          }
        ];

        setDevices(mockDevices);
        if (mockDevices.length > 0) {
          setSelectedDevice(mockDevices[0]);
        }
      } catch (err) {
        setError('Failed to load Mikrotik devices');
      } finally {
        setLoading(false);
      }
    };

    loadDevices();

    // Set up real-time updates (WebSocket connection would go here)
    const interval = setInterval(() => {
      loadDevices();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSignalColor = (strength: number) => {
    if (strength > -50) return 'text-green-500';
    if (strength > -70) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Network Monitor</h2>
          <p className="text-gray-600">Real-time Mikrotik device monitoring</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Device Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
              selectedDevice?.id === device.id
                ? 'border-blue-500 bg-blue-50'
                : device.status === 'online'
                ? 'border-green-200 bg-white hover:border-green-300'
                : 'border-red-200 bg-red-50 hover:border-red-300'
            }`}
            onClick={() => setSelectedDevice(device)}
          >
            {/* Status Indicator */}
            <div className="absolute top-4 right-4">
              {device.status === 'online' ? (
                <div className="flex items-center gap-1 text-green-600">
                  <Wifi className="w-5 h-5" />
                  <span className="text-sm font-medium">Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <WifiOff className="w-5 h-5" />
                  <span className="text-sm font-medium">Offline</span>
                </div>
              )}
            </div>

            {/* Device Info */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{device.name}</h3>
              <p className="text-sm text-gray-600">{device.ip}</p>
              {device.uptime && (
                <p className="text-xs text-gray-500 mt-1">Uptime: {device.uptime}</p>
              )}
            </div>

            {/* Alerts */}
            {device.alerts && device.alerts.length > 0 && (
              <div className="space-y-1">
                {device.alerts.slice(0, 2).map((alert, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-1 text-xs ${
                      alert.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>{alert.message}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Stats */}
            {device.status === 'online' && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center">
                  <Cpu className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                  <p className="text-xs text-gray-600">{device.cpuLoad}%</p>
                </div>
                <div className="text-center">
                  <Activity className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                  <p className="text-xs text-gray-600">{device.memoryUsage}%</p>
                </div>
                <div className="text-center">
                  <HardDrive className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                  <p className="text-xs text-gray-600">{device.diskUsage}%</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Device Details */}
      {selectedDevice && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Resources */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-600" />
              System Resources
            </h3>

            {selectedDevice.status === 'online' ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">CPU Usage</span>
                    <span className="text-sm font-medium">{selectedDevice.cpuLoad}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        selectedDevice.cpuLoad! > 80 ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${selectedDevice.cpuLoad}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Memory Usage</span>
                    <span className="text-sm font-medium">{selectedDevice.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        selectedDevice.memoryUsage! > 85 ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${selectedDevice.memoryUsage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Disk Usage</span>
                    <span className="text-sm font-medium">{selectedDevice.diskUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        selectedDevice.diskUsage! > 90 ? 'bg-red-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${selectedDevice.diskUsage}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Device is offline</p>
            )}
          </div>

          {/* Interfaces */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Network Interfaces
            </h3>

            {selectedDevice.status === 'online' && selectedDevice.interfaces ? (
              <div className="space-y-3">
                {selectedDevice.interfaces.map((iface, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{iface.name}</p>
                      <p className="text-xs text-gray-600">{iface.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <div className={`w-2 h-2 rounded-full ${
                          iface.status === 'up' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="text-xs font-medium capitalize">{iface.status}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <p>↓ {formatBytes(iface.rxBytes)}/s</p>
                        <p>↑ {formatBytes(iface.txBytes)}/s</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No interface data available</p>
            )}
          </div>

          {/* Wireless Clients */}
          <div className="bg-white p-6 rounded-xl shadow-sm border lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Connected Clients
            </h3>

            {selectedDevice.status === 'online' && selectedDevice.wirelessClients && selectedDevice.wirelessClients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-600 border-b">
                      <th className="pb-2">MAC Address</th>
                      <th className="pb-2">IP Address</th>
                      <th className="pb-2">Signal</th>
                      <th className="pb-2">SNR</th>
                      <th className="pb-2">Rate</th>
                      <th className="pb-2">Uptime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDevice.wirelessClients.map((client, index) => (
                      <tr key={index} className="border-b text-sm">
                        <td className="py-2 font-mono">{client.macAddress}</td>
                        <td className="py-2">{client.ipAddress}</td>
                        <td className={`py-2 ${getSignalColor(client.signalStrength)}`}>
                          {client.signalStrength} dBm
                        </td>
                        <td className="py-2">{client.signalToNoise} dB</td>
                        <td className="py-2">{client.txRate}</td>
                        <td className="py-2">{client.uptime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No wireless clients connected</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MikrotikMonitor;