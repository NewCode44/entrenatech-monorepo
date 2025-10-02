import React, { useState, useEffect } from 'react';
import Icon from '@/ui/Icon';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      console.log('Entrenatech PWA: App was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Entrenatech PWA: User accepted the install prompt');
    } else {
      console.log('Entrenatech PWA: User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Hide for 24 hours
    localStorage.setItem('entrenatech-pwa-install-dismissed', Date.now().toString());
  };

  // Check if user dismissed recently
  useEffect(() => {
    const dismissed = localStorage.getItem('entrenatech-pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < twentyFourHours) {
        setShowInstallPrompt(false);
      }
    }
  }, []);

  // Don't show if already installed or no prompt available
  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto animate-slide-up">
      <div className="glass-bg rounded-xl shadow-xl border border-gray-700 p-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Download" className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center">
              Instalar Entrenatech 💪
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              Lleva tu entrenamiento contigo. Acceso rápido, notificaciones de workout y más.
            </p>
            
            <div className="flex space-x-2">
              <button
                onClick={handleInstallClick}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all font-bold shadow-lg hover:shadow-xl"
              >
                <Icon name="Zap" className="w-4 h-4" />
                <span>¡Instalar App!</span>
              </button>
              
              <button
                onClick={handleDismiss}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-all"
              >
                <span>Después</span>
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white p-1 transition-colors"
          >
            <Icon name="X" className="w-4 h-4" />
          </button>
        </div>
        
        {/* App Benefits */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
            <div className="text-center">
              <Icon name="Wifi" className="w-4 h-4 mx-auto mb-1 text-green-400" />
              <span>Funciona offline</span>
            </div>
            <div className="text-center">
              <Icon name="Bell" className="w-4 h-4 mx-auto mb-1 text-blue-400" />
              <span>Recordatorios</span>
            </div>
            <div className="text-center">
              <Icon name="Zap" className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
              <span>Acceso rápido</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;