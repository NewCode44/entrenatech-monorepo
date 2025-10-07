import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';

export function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          <Outlet /> {/* Aquí se renderizarán las páginas */}
        </main>
      </div>
    </div>
  );
}