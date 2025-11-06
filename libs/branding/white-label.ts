// Sistema White Label - Personalización dinámica de marca por gym
// Permite que cada gym tenga su propia identidad visual sin necesidad de app separada

export interface GymBranding {
  id: string;
  gymId: string;
  // Identidad visual
  logoUrl: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;

  // Información del gym
  gymName: string;
  gymTagline: string;
  gymDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;

  // Configuración de dominio
  subdomain: string; // ej: "mikegym" para mikegym.entrenatech.app
  customDomain?: string; // ej: "mikegym.app"

  // Configuración de app
  appName: string;
  appShortName: string;
  appDescription: string;

  // Configuración de PWA
  pwaIcon192: string;
  pwaIcon512: string;
  pwaSplashImage?: string;

  // Configuración de emails
  emailLogo?: string;
  emailFooter: string;

  // Configuración de portal WiFi
  wifiWelcomeMessage: string;
  wifiBackgroundImage?: string;

  // Estado
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export class WhiteLabelService {
  private static instance: WhiteLabelService;
  private brandingCache: Map<string, GymBranding> = new Map();
  private themeCache: Map<string, ThemeConfig> = new Map();

  /**
   * Obtener branding por subdominio o dominio personalizado
   */
  async getBrandingByDomain(domain: string): Promise<GymBranding | null> {
    try {
      // Verificar cache primero
      if (this.brandingCache.has(domain)) {
        return this.brandingCache.get(domain)!;
      }

      // Buscar en Firestore
      const branding = await this.findBrandingByDomain(domain);

      if (branding) {
        this.brandingCache.set(domain, branding);
        return branding;
      }

      // Retornar branding por defecto (EntrenaTech)
      return this.getDefaultBranding();

    } catch (error) {
      console.error('Error obteniendo branding:', error);
      return this.getDefaultBranding();
    }
  }

  /**
   * Obtener branding por gymId
   */
  async getBrandingByGymId(gymId: string): Promise<GymBranding | null> {
    try {
      const { getFirestore } = await import('firebase/firestore');
      const db = getFirestore();

      const doc = await db.collection('gymBranding').doc(gymId).get();

      if (doc.exists) {
        return doc.data() as GymBranding;
      }

      return this.getDefaultBranding();

    } catch (error) {
      console.error('Error obteniendo branding por gymId:', error);
      return this.getDefaultBranding();
    }
  }

  /**
   * Generar tema CSS dinámico basado en branding
   */
  generateThemeCSS(branding: GymBranding): string {
    const theme: ThemeConfig = {
      colors: {
        primary: branding.primaryColor,
        secondary: branding.secondaryColor,
        accent: branding.accentColor,
        background: branding.backgroundColor,
        surface: this.lightenColor(branding.backgroundColor, 5),
        text: branding.textColor,
        textSecondary: this.lightenColor(branding.textColor, 30),
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      },
      typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        },
        fontWeight: {
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700
        }
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem'
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }
    };

    return this.generateCSSVariables(theme);
  }

  /**
   * Generar manifest.json para PWA personalizado
   */
  generatePWAManifest(branding: GymBranding): any {
    return {
      name: branding.appName,
      short_name: branding.appShortName,
      description: branding.appDescription,
      start_url: `/?gym=${branding.gymId}`,
      display: 'standalone',
      background_color: branding.backgroundColor,
      theme_color: branding.primaryColor,
      orientation: 'portrait',
      scope: '/',
      icons: [
        {
          src: branding.pwaIcon192,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: branding.pwaIcon512,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ],
      screenshots: branding.pwaSplashImage ? [{
        src: branding.pwaSplashImage,
        sizes: '1280x720',
        type: 'image/jpeg',
        form_factor: 'wide'
      }] : [],
      categories: ['fitness', 'health', 'lifestyle'],
      lang: 'es'
    };
  }

  /**
   * Generar service worker para PWA con caching personalizado
   */
  generateServiceWorker(branding: GymBranding): string {
    return `
// Service Worker para ${branding.appName}
const CACHE_NAME = '${branding.gymId}-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '${branding.pwaIcon192}',
  '${branding.pwaIcon512}',
  '${branding.logoUrl}'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
`;
  }

  /**
   * Actualizar branding de un gym
   */
  async updateBranding(gymId: string, branding: Partial<GymBranding>): Promise<boolean> {
    try {
      const { getFirestore, serverTimestamp } = await import('firebase/firestore');
      const db = getFirestore();

      await db.collection('gymBranding').doc(gymId).update({
        ...branding,
        updatedAt: serverTimestamp()
      });

      // Limpiar cache
      this.brandingCache.clear();
      this.themeCache.clear();

      return true;

    } catch (error) {
      console.error('Error actualizando branding:', error);
      return false;
    }
  }

  /**
   * Crear branding para nuevo gym
   */
  async createBranding(gymId: string, gymData: {
    name: string;
    email: string;
    subdomain: string;
  }): Promise<GymBranding> {
    const branding: GymBranding = {
      id: gymId,
      gymId,
      logoUrl: '/default-logo.png',
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      accentColor: '#f59e0b',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      gymName: gymData.name,
      gymTagline: 'Tu gimnasio, tu estilo',
      gymDescription: 'Bienvenido a tu gimnasio',
      contactEmail: gymData.email,
      contactPhone: '',
      address: '',
      subdomain: gymData.subdomain,
      appName: `${gymData.name} App`,
      appShortName: gymData.name,
      appDescription: `App oficial de ${gymData.name}`,
      pwaIcon192: '/default-icon-192.png',
      pwaIcon512: '/default-icon-512.png',
      wifiWelcomeMessage: `¡Bienvenido a ${gymData.name}! Conecta y entrena`,
      emailFooter: `${gymData.name} - Powered by EntrenaTech`,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const { getFirestore, serverTimestamp } = await import('firebase/firestore');
    const db = getFirestore();

    await db.collection('gymBranding').doc(gymId).set({
      ...branding,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return branding;
  }

  // === Métodos privados ===

  private async findBrandingByDomain(domain: string): Promise<GymBranding | null> {
    const { getFirestore } = await import('firebase/firestore');
    const db = getFirestore();

    // Buscar por subdominio
    const subdomainQuery = await db
      .collection('gymBranding')
      .where('subdomain', '==', domain)
      .where('active', '==', true)
      .limit(1)
      .get();

    if (!subdomainQuery.empty) {
      return subdomainQuery.docs[0].data() as GymBranding;
    }

    // Buscar por dominio personalizado
    const customDomainQuery = await db
      .collection('gymBranding')
      .where('customDomain', '==', domain)
      .where('active', '==', true)
      .limit(1)
      .get();

    if (!customDomainQuery.empty) {
      return customDomainQuery.docs[0].data() as GymBranding;
    }

    return null;
  }

  private getDefaultBranding(): GymBranding {
    return {
      id: 'entrenatech-default',
      gymId: 'entrenatech',
      logoUrl: '/logo.png',
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      accentColor: '#f59e0b',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      gymName: 'EntrenaTech',
      gymTagline: 'Plataforma de Gimnasios Inteligentes',
      gymDescription: 'La plataforma más completa para gestión de gimnasios',
      contactEmail: 'hola@entrenatech.app',
      contactPhone: '',
      address: '',
      subdomain: 'app',
      appName: 'EntrenaTech',
      appShortName: 'EntrenaTech',
      appDescription: 'Plataforma de gimnasios con IA',
      pwaIcon192: '/icon-192.png',
      pwaIcon512: '/icon-512.png',
      wifiWelcomeMessage: '¡Bienvenido a EntrenaTech! Conecta y comienza tu entrenamiento',
      emailFooter: 'EntrenaTech - Transformando gimnasios con tecnología',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private generateCSSVariables(theme: ThemeConfig): string {
    return `
:root {
  /* Colors */
  --color-primary: ${theme.colors.primary};
  --color-secondary: ${theme.colors.secondary};
  --color-accent: ${theme.colors.accent};
  --color-background: ${theme.colors.background};
  --color-surface: ${theme.colors.surface};
  --color-text: ${theme.colors.text};
  --color-text-secondary: ${theme.colors.textSecondary};
  --color-success: ${theme.colors.success};
  --color-warning: ${theme.colors.warning};
  --color-error: ${theme.colors.error};

  /* Typography */
  --font-family: ${theme.typography.fontFamily};
  --font-size-xs: ${theme.typography.fontSize.xs};
  --font-size-sm: ${theme.typography.fontSize.sm};
  --font-size-base: ${theme.typography.fontSize.base};
  --font-size-lg: ${theme.typography.fontSize.lg};
  --font-size-xl: ${theme.typography.fontSize.xl};
  --font-size-2xl: ${theme.typography.fontSize['2xl']};
  --font-size-3xl: ${theme.typography.fontSize['3xl']};

  --font-weight-light: ${theme.typography.fontWeight.light};
  --font-weight-normal: ${theme.typography.fontWeight.normal};
  --font-weight-medium: ${theme.typography.fontWeight.medium};
  --font-weight-semibold: ${theme.typography.fontWeight.semibold};
  --font-weight-bold: ${theme.typography.fontWeight.bold};

  /* Spacing */
  --spacing-xs: ${theme.spacing.xs};
  --spacing-sm: ${theme.spacing.sm};
  --spacing-md: ${theme.spacing.md};
  --spacing-lg: ${theme.spacing.lg};
  --spacing-xl: ${theme.spacing.xl};
  --spacing-2xl: ${theme.spacing['2xl']};

  /* Border Radius */
  --radius-sm: ${theme.borderRadius.sm};
  --radius-md: ${theme.borderRadius.md};
  --radius-lg: ${theme.borderRadius.lg};
  --radius-xl: ${theme.borderRadius.xl};

  /* Shadows */
  --shadow-sm: ${theme.shadows.sm};
  --shadow-md: ${theme.shadows.md};
  --shadow-lg: ${theme.shadows.lg};
  --shadow-xl: ${theme.shadows.xl};
}

/* Component styles based on theme */
.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.surface {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
}

.text-primary { color: var(--color-primary); }
.text-secondary { color: var(--color-secondary); }
.text-accent { color: var(--color-accent); }
.text-success { color: var(--color-success); }
.text-warning { color: var(--color-warning); }
.text-error { color: var(--color-error); }
`;
  }

  private lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  }

  static getInstance(): WhiteLabelService {
    if (!WhiteLabelService.instance) {
      WhiteLabelService.instance = new WhiteLabelService();
    }
    return WhiteLabelService.instance;
  }
}

export const whiteLabelService = WhiteLabelService.getInstance();