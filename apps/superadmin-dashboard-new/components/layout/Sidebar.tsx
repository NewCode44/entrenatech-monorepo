import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Router,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';

type SuperAdminPage = 'Dashboard' | 'Gimnasios' | 'Mikrotiks' | 'Analíticas' | 'Configuración';

interface SidebarProps {
  currentPage: SuperAdminPage;
  setCurrentPage: (page: SuperAdminPage) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navigationItems = [
  {
    id: 'Dashboard' as SuperAdminPage,
    label: 'Dashboard',
    icon: LayoutDashboard,
    color: 'text-blue-600'
  },
  {
    id: 'Gimnasios' as SuperAdminPage,
    label: 'Gimnasios',
    icon: Building2,
    color: 'text-purple-600'
  },
  {
    id: 'Mikrotiks' as SuperAdminPage,
    label: 'Mikrotiks',
    icon: Router,
    color: 'text-orange-600'
  },
  {
    id: 'Analíticas' as SuperAdminPage,
    label: 'Analíticas',
    icon: BarChart3,
    color: 'text-green-600'
  },
  {
    id: 'Configuración' as SuperAdminPage,
    label: 'Configuración',
    icon: Settings,
    color: 'text-gray-600'
  }
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SA</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">SuperAdmin</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">EntrenaTech Platform</p>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="ml-auto lg:hidden p-1 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsOpen(false); // Close on mobile after selection
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? item.color : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 p-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">AD</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Super Administrator</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;