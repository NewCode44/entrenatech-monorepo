import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Router,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';

type Page = 'Dashboard' | 'Gimnasios' | 'Mikrotiks' | 'Analíticas' | 'Configuración';

interface LayoutProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentPage, setCurrentPage, children }) => {
  const menuItems = [
    {
      id: 'Dashboard' as Page,
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-600'
    },
    {
      id: 'Gimnasios' as Page,
      label: 'Gimnasios',
      icon: Building2,
      color: 'text-purple-600'
    },
    {
      id: 'Mikrotiks' as Page,
      label: 'Mikrotiks',
      icon: Router,
      color: 'text-orange-600'
    },
    {
      id: 'Analíticas' as Page,
      label: 'Analíticas',
      icon: BarChart3,
      color: 'text-green-600'
    },
    {
      id: 'Configuración' as Page,
      label: 'Configuración',
      icon: Settings,
      color: 'text-gray-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        menuItems={menuItems}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header currentPage={currentPage} />

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;