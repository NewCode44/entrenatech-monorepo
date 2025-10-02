
import React from 'react';
import { Page, NavItem } from '@/types/index';
import { NAVIGATION_ITEMS } from '../../constants';
import Icon from '@/ui/Icon';
import EntrenaTechLogo from '../EntrenaTechLogo';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SidebarContent: React.FC<{ currentPage: Page; setCurrentPage: (page: Page) => void }> = ({ currentPage, setCurrentPage }) => (
  <>
    <div>
      {/* Compact Logo */}
      <div className="flex justify-center mb-6">
         <EntrenaTechLogo size="sm" variant="icon" theme="dark" />
      </div>

      {/* Compact Navigation */}
      <nav>
        <ul className="space-y-1 flex flex-col items-center">
          {NAVIGATION_ITEMS.map((item: NavItem) => (
            <li key={item.label}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(item.label);
                }}
                className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 group relative ${
                  currentPage === item.label
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-gray-500 hover:bg-gray-800 hover:text-white'
                }`}
                title={item.label}
              >
                <Icon name={item.icon} className="w-5 h-5" />

                {/* Tooltip */}
                <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap border border-gray-700">
                  {item.label}
                  <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>

    {/* Compact Footer */}
    <div className="text-center">
      <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mx-auto">
        <span className="text-xs text-gray-400 font-bold">ET</span>
      </div>
    </div>
  </>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    setIsOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-50 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-secondary flex flex-col justify-between z-50 transition-all transform
                         lg:static lg:transform-none lg:translate-x-0 lg:w-20 lg:p-4
                         ${isOpen ? 'translate-x-0 w-64 p-4' : '-translate-x-full w-20 p-4'}`}>
        {/* Mobile: Full sidebar, Desktop: Compact sidebar */}
        <div className="lg:hidden">
          {/* Full sidebar for mobile */}
          <div>
            <div className="flex items-center space-x-3 mb-12">
               <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center rounded-lg shadow-glow">
                 <span className="font-black text-2xl text-white">E</span>
               </div>
               <h1 className="text-xl font-bold text-white tracking-tighter">
                 ENTRENATECH
               </h1>
            </div>
            <nav>
              <ul>
                {NAVIGATION_ITEMS.map((item: NavItem) => (
                  <li key={item.label}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(item.label);
                      }}
                      className={`flex items-center px-4 py-3 my-1 rounded-lg transition-all duration-200 group ${
                        currentPage === item.label
                          ? 'bg-gray-900 text-white font-semibold'
                          : 'text-gray-500 hover:bg-gray-900 hover:text-white'
                      }`}
                    >
                      <Icon name={item.icon} className={`w-5 h-5 mr-4 ${currentPage === item.label ? 'text-primary' : ''}`} />
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="text-center text-gray-700 text-xs">
            <p>&copy; 2024 Entrenatech Unicorn</p>
            <p>v1.0 Premium</p>
          </div>
        </div>

        {/* Desktop: Compact sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:justify-between lg:h-full">
          <SidebarContent currentPage={currentPage} setCurrentPage={handleNavigation} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;