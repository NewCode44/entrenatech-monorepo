import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { DashboardPage } from './pages/dashboard/dashboard-page';
import { GymsListPage } from './pages/gyms/gyms-list-page';
import { GymDetailPage } from './pages/gyms/gym-detail-page';
import { MikrotiksListPage } from './pages/mikrotiks/mikrotiks-list-page';
import { MikrotikDetailPage } from './pages/mikrotiks/mikrotik-detail-page';
import { AnalyticsPage } from './pages/analytics/analytics-page';
import { SettingsPage } from './pages/settings/settings-page';

type Page = 'Dashboard' | 'Gimnasios' | 'Mikrotiks' | 'Analíticas' | 'Configuración';

const AppWithRouting: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageFromPath = (): Page => {
    const path = location.pathname;
    if (path.startsWith('/gyms')) return 'Gimnasios';
    if (path.startsWith('/mikrotiks')) return 'Mikrotiks';
    if (path.startsWith('/analytics')) return 'Analíticas';
    if (path.startsWith('/settings')) return 'Configuración';
    return 'Dashboard';
  };

  const currentPage = getPageFromPath();
  const setCurrentPage = (page: Page) => {
    switch (page) {
      case 'Dashboard':
        navigate('/');
        break;
      case 'Gimnasios':
        navigate('/gyms');
        break;
      case 'Mikrotiks':
        navigate('/mikrotiks');
        break;
      case 'Analíticas':
        navigate('/analytics');
        break;
      case 'Configuración':
        navigate('/settings');
        break;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/gyms" element={<GymsListPage />} />
        <Route path="/gyms/:gymId" element={<GymDetailPage />} />
        <Route path="/mikrotiks" element={<MikrotiksListPage />} />
        <Route path="/mikrotiks/:mikrotikId" element={<MikrotikDetailPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppWithRouting />
    </Router>
  );
};

export default App;