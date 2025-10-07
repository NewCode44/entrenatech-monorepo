import React, { useState } from 'react';
import { Router, Building2, Server, Wifi, Activity } from 'lucide-react';
import { Mikrotik } from '@/types';

interface AddMikrotikModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMikrotik: (mikrotik: Omit<Mikrotik, 'id'>) => void;
  gyms: Array<{ id: string; name: string }>;
}

export const AddMikrotikModal: React.FC<AddMikrotikModalProps> = ({ isOpen, onClose, onAddMikrotik, gyms }) => {
  const [formData, setFormData] = useState({
    name: '',
    ipAddress: '',
    gymId: '',
    version: 'RouterOS 7.12'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newMikrotik: Omit<Mikrotik, 'id'> = {
      ...formData,
      status: 'offline', // New mikrotiks start as offline until configured
      uptime: '0d 0h 0m',
      cpuLoad: 0,
      memoryUsage: 0,
      connectedDevices: 0
    };

    onAddMikrotik(newMikrotik);
    setFormData({
      name: '',
      ipAddress: '',
      gymId: '',
      version: 'RouterOS 7.12'
    });
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${!isOpen && 'hidden'}`}>
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Router className="w-5 h-5 text-orange-500" />
              Nuevo Mikrotik
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del Router *
                </label>
                <div className="relative">
                  <Router className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ej: Router PowerFit"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dirección IP *
                </label>
                <div className="relative">
                  <Wifi className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    required
                    pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
                    value={formData.ipAddress}
                    onChange={(e) => handleChange('ipAddress', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
                    placeholder="192.168.1.1"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Formato: 192.168.1.1</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gimnasio Asignado *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    required
                    value={formData.gymId}
                    onChange={(e) => handleChange('gymId', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Seleccionar gimnasio</option>
                    {gyms.map(gym => (
                      <option key={gym.id} value={gym.id}>
                        {gym.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Versión del RouterOS
                </label>
                <div className="relative">
                  <Server className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={formData.version}
                    onChange={(e) => handleChange('version', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                  >
                    <option value="RouterOS 7.12">RouterOS 7.12</option>
                    <option value="RouterOS 7.11">RouterOS 7.11</option>
                    <option value="RouterOS 7.10">RouterOS 7.10</option>
                    <option value="RouterOS 7.9">RouterOS 7.9</option>
                    <option value="RouterOS 6.49">RouterOS 6.49</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-2">
                <Activity className="w-4 h-4 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-900 dark:text-blue-200 font-medium">Nota:</p>
                  <p className="text-blue-700 dark:text-blue-300">
                    El nuevo Mikrotik aparecerá como "Fuera de línea" hasta que se configure y conecte.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
              >
                <Router className="w-4 h-4" />
                Agregar Mikrotik
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};