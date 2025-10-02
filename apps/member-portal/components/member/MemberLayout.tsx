import React, { ReactNode } from 'react';
import { Home, TrendingUp, Dumbbell, Apple, Calendar, Bell, User, ShoppingBag } from 'lucide-react';
import EntrenaTechLogo from '../EntrenaTechLogo';

interface MemberLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const MemberLayout: React.FC<MemberLayoutProps> = ({ children, currentPage, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'progress', label: 'Progreso', icon: TrendingUp },
    { id: 'routines', label: 'Entrenar', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrición', icon: Apple },
    { id: 'store', label: 'Tienda', icon: ShoppingBag },
    { id: 'classes', label: 'Clases', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="mx-auto max-w-md px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <EntrenaTechLogo size="sm" variant="full" theme="light" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="relative rounded-lg p-2 hover:bg-zinc-100 transition-colors">
                <Bell className="h-5 w-5 text-zinc-600" />
                <div className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-cyan-500"></div>
              </button>
              <button className="rounded-lg p-2 hover:bg-zinc-100 transition-colors">
                <User className="h-5 w-5 text-zinc-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-md px-4 pb-32 pt-16">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white/95 backdrop-blur-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-md">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`group relative flex flex-1 flex-col items-center gap-1 rounded-lg px-3 py-2 transition-all ${
                    isActive ? 'text-cyan-500' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute -top-0.5 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                  )}

                  {/* Icon */}
                  <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform`} />

                  {/* Label */}
                  <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MemberLayout;
