import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import DashboardSuperAdmin from './pages/DashboardSuperAdmin';
import GymsManagement from './pages/GymsManagement';
import MikrotiksManagement from './pages/MikrotiksManagement';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import PWAInstallPrompt from './components/PWAInstallPrompt';

type SuperAdminPage = 'Dashboard' | 'Gimnasios' | 'Mikrotiks' | 'Analíticas' | 'Configuración';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<SuperAdminPage>('Dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <DashboardSuperAdmin />;
      case 'Gimnasios':
        return <GymsManagement />;
      case 'Mikrotiks':
        return <MikrotiksManagement />;
      case 'Analíticas':
        return <Analytics />;
      case 'Configuración':
        return <Settings />;
      default:
        return <DashboardSuperAdmin />;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
      <PWAInstallPrompt />
    </Layout>
  );
};

export default App;