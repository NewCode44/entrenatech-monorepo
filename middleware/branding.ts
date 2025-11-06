// Middleware de Branding - Aplica White Label dinámicamente a todas las páginas
import { Request, Response, NextFunction } from 'express';
import { whiteLabelService, GymBranding } from '../libs/branding/white-label';

export interface BrandedRequest extends Request {
  branding?: GymBranding;
  gymId?: string;
}

/**
 * Middleware principal de branding
 */
export async function brandingMiddleware(
  req: BrandedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extraer dominio/subdominio de la request
    const domain = extractDomain(req);

    // Obtener branding para este dominio
    const branding = await whiteLabelService.getBrandingByDomain(domain);

    if (branding) {
      req.branding = branding;
      req.gymId = branding.gymId;

      // Inyectar variables de branding en locals para templates
      res.locals.branding = branding;
      res.locals.themeCSS = whiteLabelService.generateThemeCSS(branding);
      res.locals.pwaManifest = whiteLabelService.generatePWAManifest(branding);
    }

    next();
  } catch (error) {
    console.error('Error en branding middleware:', error);
    next();
  }
}

/**
 * Middleware para servir PWA manifest dinámico
 */
export async function pwaManifestMiddleware(
  req: BrandedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.branding) {
      return res.status(404).json({ error: 'Branding not found' });
    }

    const manifest = whiteLabelService.generatePWAManifest(req.branding);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json(manifest);
  } catch (error) {
    console.error('Error generando PWA manifest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Middleware para servir service worker dinámico
 */
export async function serviceWorkerMiddleware(
  req: BrandedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.branding) {
      return res.status(404).send('Service Worker not found');
    }

    const serviceWorkerCode = whiteLabelService.generateServiceWorker(req.branding);

    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'public, max-age=0');
    res.send(serviceWorkerCode);
  } catch (error) {
    console.error('Error generando service worker:', error);
    res.status(500).send('Service Worker error');
  }
}

/**
 * Middleware para inyectar branding en HTML
 */
export function injectBrandingHTML(
  req: BrandedRequest,
  res: Response,
  next: NextFunction
): void {
  const originalSend = res.send;

  res.send = function(data) {
    if (typeof data === 'string' && req.branding) {
      // Inyectar CSS de tema
      const themeCSS = whiteLabelService.generateThemeCSS(req.branding);

      // Inyectar branding en el HTML
      data = data
        .replace(
          '<head>',
          `<head>
<style>${themeCSS}</style>
<link rel="manifest" href="/manifest.json?gym=${req.branding.gymId}">
<link rel="apple-touch-icon" href="${req.branding.pwaIcon192}">
<meta name="theme-color" content="${req.branding.primaryColor}">
<meta name="apple-mobile-web-app-title" content="${req.branding.appShortName}">
<meta name="application-name" content="${req.branding.appName}">
<meta name="description" content="${req.branding.appDescription}">
<meta property="og:title" content="${req.branding.appName}">
<meta property="og:description" content="${req.branding.appDescription}">
<meta property="og:image" content="${req.branding.logoUrl}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${req.branding.appName}">
<meta name="twitter:description" content="${req.branding.appDescription}">
<meta name="twitter:image" content="${req.branding.logoUrl}">
`
        )
        .replace(
          '<title>EntrenaTech</title>',
          `<title>${req.branding.appName}</title>`
        )
        .replace(
          'EntrenaTech Platform',
          req.branding.appName
        )
        .replace(
          '/logo.png',
          req.branding.logoUrl
        );
    }

    originalSend.call(this, data);
  };

  next();
}

/**
 * Middleware para portal cautivo con branding
 */
export async function captivePortalBranding(
  req: BrandedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Para portal WiFi, usar branding del gym si está especificado
    const gymCode = req.query.gym || req.body.gymCode;

    if (gymCode && typeof gymCode === 'string') {
      const branding = await whiteLabelService.getBrandingByGymId(gymCode);

      if (branding) {
        req.branding = branding;
        res.locals.branding = branding;
        res.locals.themeCSS = whiteLabelService.generateThemeCSS(branding);
      }
    }

    next();
  } catch (error) {
    console.error('Error en branding de portal cautivo:', error);
    next();
  }
}

/**
 * Helper function para extraer dominio de request
 */
function extractDomain(req: Request): string {
  const host = req.get('host') || '';

  // Remover puerto si existe
  const hostWithoutPort = host.split(':')[0];

  // Si es localhost o IP, retornar default
  if (hostWithoutPort === 'localhost' ||
      hostWithoutPort.startsWith('192.168.') ||
      hostWithoutPort.startsWith('10.') ||
      hostWithoutPort.startsWith('172.')) {
    return 'entrenatech';
  }

  // Extraer subdominio
  const parts = hostWithoutPort.split('.');

  if (parts.length > 2) {
    // Tiene subdominio (ej: mikegym.entrenatech.app)
    return parts[0];
  } else if (parts.length === 2) {
    // Dominio simple (ej: entrenatech.app o custom domain)
    return hostWithoutPort;
  }

  return hostWithoutPort;
}

/**
 * Middleware para API endpoints con validación de gym
 */
export function validateGymAccess(
  req: BrandedRequest,
  res: Response,
  next: NextFunction
): void {
  // Verificar que el request tenga un gym válido
  if (!req.gymId) {
    return res.status(400).json({
      error: 'Gym ID requerido',
      code: 'MISSING_GYM_ID'
    });
  }

  // Para endpoints de admin, verificar que el usuario tenga acceso a este gym
  if (req.path.startsWith('/api/admin/') || req.path.startsWith('/api/gym/')) {
    // Aquí iría lógica de validación de permisos
    // Por ahora, solo verificamos que existe branding
    if (!req.branding) {
      return res.status(403).json({
        error: 'Acceso denegado - Gym no encontrado',
        code: 'GYM_NOT_FOUND'
      });
    }
  }

  next();
}

/**
 * Middleware para logging con branding info
 */
export function brandingLogger(
  req: BrandedRequest,
  res: Response,
  next: NextFunction
): void {
  if (req.branding) {
    console.log(`📱 ${req.branding.appName} (${req.branding.gymId}) - ${req.method} ${req.path}`);
  } else {
    console.log(`🌐 EntrenaTech - ${req.method} ${req.path}`);
  }

  next();
}