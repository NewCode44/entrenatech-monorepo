import React from 'react';
import {
  Bell,
  Search,
  LogOut,
  Menu,
  Sun,
  Moon
} from 'lucide-react';

type SuperAdminPage = 'Dashboard' | 'Gimnasios' | 'Mikrotiks' | 'Analíticas' | 'Configuración';

interface HeaderProps {
  currentPage: SuperAdminPage;
  onMenuClick: () => void;
  setCurrentPage: (page: SuperAdminPage) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onMenuClick }) => {
  const getPageTitle = (page: SuperAdminPage): string => {
    switch (page) {
      case 'Dashboard':
        return 'Dashboard';
      case 'Gimnasios':
        return 'Gimnasios';
      case 'Mikrotiks':
        return 'Mikrotiks';
      case 'Analíticas':
        return 'Analíticas';
      case 'Configuración':
        return 'Configuración';
      default:
        return 'Dashboard';
    }
  };

  const getPageDescription = (page: SuperAdminPage): string => {
    switch (page) {
      case 'Dashboard':
        return 'Vista general de toda la plataforma';
      case 'Gimnasios':
        return 'Gestión de gimnasios y sus configuraciones';
      case 'Mikrotiks':
        return 'Monitoreo de equipos de red';
      case 'Analíticas':
        return 'Reportes y estadísticas';
      case 'Configuración':
        return 'Configuración del sistema';
      default:
        return '';
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page Title */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {getPageTitle(currentPage)}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getPageDescription(currentPage)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Theme Toggle */}
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Sun className="w-5 h-5 hidden dark:block" />
              <Moon className="w-5 h-5 block dark:hidden" />
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AD</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Super Administrator</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;