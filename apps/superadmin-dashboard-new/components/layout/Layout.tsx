import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

type SuperAdminPage = 'Dashboard' | 'Gimnasios' | 'Mikrotiks' | 'Analíticas' | 'Configuración';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: SuperAdminPage;
  setCurrentPage: (page: SuperAdminPage) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header
          currentPage={currentPage}
          onMenuClick={() => setSidebarOpen(true)}
          setCurrentPage={setCurrentPage}
        />

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;