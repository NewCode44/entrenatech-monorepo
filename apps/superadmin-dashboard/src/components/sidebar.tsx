import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Router,
  BarChart3,
  Settings,
  Bell,
  Search,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard'
  },
  {
    id: 'gyms',
    label: 'Gimnasios',
    icon: Building2,
    path: '/gyms'
  },
  {
    id: 'mikrotiks',
    label: 'Mikrotiks',
    icon: Router,
    path: '/mikrotiks'
  },
  {
    id: 'analytics',
    label: 'Analíticas',
    icon: BarChart3,
    path: '/analytics'
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: Settings,
    path: '/settings'
  }
];

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();

  return (
    <div className={cn(
      "flex flex-col h-full bg-gray-900 border-r border-gray-800 w-64",
      className
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-800">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">ET</span>
        </div>
        <div>
          <h1 className="text-white font-bold text-lg">EntrenaTech</h1>
          <p className="text-gray-400 text-xs">SuperAdmin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-purple-500/10 text-purple-400 border-l-2 border-purple-500"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">Super Admin</p>
            <p className="text-gray-400 text-xs truncate">admin@entrenatech.com</p>
          </div>
        </div>
        <button className="flex items-center gap-2 w-full px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm">
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};