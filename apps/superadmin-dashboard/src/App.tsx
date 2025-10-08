import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/dashboard/dashboard-page';
import GymsListPage from './pages/gyms/gyms-list-page';
import GymDetailPage from './pages/gyms/gym-detail-page';
import MikrotiksListPage from './pages/mikrotiks/mikrotiks-list-page';
import MikrotikDetailPage from './pages/mikrotiks/mikrotik-detail-page';
import AnalyticsPage from './pages/analytics/analytics-page';
import SettingsPage from './pages/settings/settings-page';

type Page = 'Dashboard' | 'Gimnasios' | 'Mikrotiks' | 'Analíticas' | 'Configuración';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [selectedGym, setSelectedGym] = useState<any>(null);
  const [selectedMikrotik, setSelectedMikrotik] = useState<any>(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Gimnasios':
        return selectedGym ? (
          <GymDetailPage gymId={selectedGym.id} onBack={() => setSelectedGym(null)} />
        ) : (
          <GymsListPage onSelectGym={setSelectedGym} />
        );
      case 'Mikrotiks':
        return selectedMikrotik ? (
          <MikrotikDetailPage mikrotikId={selectedMikrotik.id} onBack={() => setSelectedMikrotik(null)} />
        ) : (
          <MikrotiksListPage onSelectMikrotik={setSelectedMikrotik} />
        );
      case 'Analíticas':
        return <AnalyticsPage />;
      case 'Configuración':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

export default App;