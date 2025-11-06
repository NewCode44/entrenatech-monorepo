import React, { useState, useEffect } from 'react';
import MemberLayout from './components/member/MemberLayout';
import HomePage from './pages/HomePage';
import ProgressPage from './pages/ProgressPage';
import RoutinesPage from './pages/RoutinesPage';
import NutritionPage from './pages/NutritionPage';
import ClassesPage from './pages/ClassesPage';
import StorePage from './pages/StorePage';
import SpotifyCallback from './pages/SpotifyCallback';
import MusicPlayer from './components/MusicPlayer';
import PageTransition from './components/PageTransition';

type PageType = 'home' | 'progress' | 'routines' | 'nutrition' | 'store' | 'classes';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  // Check if we're on the callback route
  useEffect(() => {
    if (window.location.pathname === '/member/spotify-callback') {
      // Don't render the main app, let the component handle it
      return;
    }
  }, []);

  // If we're on the callback route, render only the callback component
  if (window.location.pathname === '/member/spotify-callback') {
    return <SpotifyCallback />;
  }

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