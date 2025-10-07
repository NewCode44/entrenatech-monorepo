import React, { useState } from 'react';
import { Bell, Search, HelpCircle, Moon, Sun, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  return (
    <header className={cn(
      "bg-gray-900 border-b border-gray-800 px-6 py-4",
      className
    )}>
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar gimnasios, Mikrotiks, configuración..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <Moon className="w-5 h-5" />
          </button>

          {/* Help */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notificaciones</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Nuevo gimnasio agregado</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PowerFit Gym ha sido añadido exitosamente</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Hace 2 minutos</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Mikrotik actualizado</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Router Iron Temple ha reiniciado</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Hace 15 minutos</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Mikrotik fuera de línea</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Router Elite Fitness no responde</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Hace 1 hora</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <button className="w-full text-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-3 border-l border-gray-700">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">SA</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Super Admin</p>
              <p className="text-gray-400 text-xs">en línea</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};