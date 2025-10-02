import React, { useState } from 'react';
import MemberLayout from './components/member/MemberLayout';
import HomePage from './pages/HomePage';
import ProgressPage from './pages/ProgressPage';
import RoutinesPage from './pages/RoutinesPage';
import NutritionPage from './pages/NutritionPage';
import ClassesPage from './pages/ClassesPage';
import StorePage from './pages/StorePage';
import MusicPlayer from './components/MusicPlayer';
import PageTransition from './components/PageTransition';

type PageType = 'home' | 'progress' | 'routines' | 'nutrition' | 'store' | 'classes';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={(page) => setCurrentPage(page as PageType)} />;
      case 'progress':
        return <ProgressPage />;
      case 'routines':
        return <RoutinesPage />;
      case 'nutrition':
        return <NutritionPage />;
      case 'store':
        return <StorePage />;
      case 'classes':
        return <ClassesPage />;
      default:
        return <HomePage onNavigate={(page) => setCurrentPage(page as PageType)} />;
    }
  };

  return (
    <>
      <MemberLayout currentPage={currentPage} onNavigate={(page) => setCurrentPage(page as PageType)}>
        <PageTransition pageKey={currentPage}>
          {renderPage()}
        </PageTransition>
      </MemberLayout>
      <MusicPlayer />
    </>
  );
};

export default App;