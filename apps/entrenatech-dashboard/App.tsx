
import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Classes from './pages/Classes';
import Trainers from './pages/Trainers';
import Analytics from './pages/Analytics';
import Routines from './pages/Routines';
import RoutineCreator from './pages/RoutineCreator';
import Store from './pages/Store';
import LiveStreaming from './pages/LiveStreaming';
import PortalContent from './pages/PortalContent';
import Settings from './pages/Settings';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { Page, Routine } from '@/types/index';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [routineToEdit, setRoutineToEdit] = useState<Routine | null>(null);

  const handleStartEditRoutine = (routine: Routine) => {
    setRoutineToEdit(routine);
    setCurrentPage('Creador de Rutinas');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'Miembros':
        return <Members />;
      case 'Clases':
        return <Classes />;
      case 'Entrenadores':
        return <Trainers />;
      case 'Rutinas':
        return <Routines setCurrentPage={setCurrentPage} onEditRoutine={handleStartEditRoutine} />;
      case 'Creador de Rutinas':
        return <RoutineCreator setCurrentPage={setCurrentPage} routineToEdit={routineToEdit} />;
      case 'Tienda':
        return <Store />;
      case 'Clases en Vivo':
        return <LiveStreaming />;
      case 'Contenido Portal':
        return <PortalContent />;
      case 'Analíticas':
        return <Analytics />;
      case 'Configuración':
        return <Settings />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
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