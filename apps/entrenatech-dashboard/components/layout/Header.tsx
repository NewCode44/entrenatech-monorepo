
import React from 'react';
import { Page } from '@/types/index';
import Icon from '@/ui/Icon';

interface HeaderProps {
  currentPage: Page;
  onMenuClick: () => void;
  setCurrentPage?: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onMenuClick, setCurrentPage }) => {
  return (
    <header className="sticky top-0 z-40">
       <div className="p-4 glass-bg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left side: Hamburger + Page Title */}
            <div className="flex items-center gap-4">
                <button 
                  onClick={onMenuClick}
                  className="lg:hidden text-gray-400 hover:text-white"
                  aria-label="Open menu"
                >
                  <Icon name="Menu" className="w-6 h-6" />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-white">{currentPage}</h2>
                    <p className="text-sm text-gray-500 hidden sm:block">Bienvenido de nuevo, Admin Premium</p>
                </div>
            </div>

            {/* Right side: Actions & User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4">
                <button className="text-gray-500 hover:text-white transition-colors relative">
                    <Icon name="Bell" className="w-6 h-6" />
                    <span className="notification-badge">3</span>
                </button>
                 <button
                    onClick={() => setCurrentPage && setCurrentPage('Configuración')}
                    className="text-gray-500 hover:text-white transition-colors"
                 >
                    <Icon name="Settings" className="w-6 h-6" />
                </button>
                <button
                    onClick={() => setCurrentPage && setCurrentPage('Configuración')}
                    className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                >
                <img
                    src="https://i.pravatar.cc/40?u=admin"
                    alt="Admin user"
                    className="w-10 h-10 rounded-full border-2 border-primary"
                />
                <div className="hidden md:block text-left">
                    <p className="font-semibold text-sm text-white">Admin Gym</p>
                    <p className="text-xs text-accent-gold">Premium</p>
                </div>
                </button>
            </div>
        </div>
       </div>
    </header>
  );
};

export default Header;