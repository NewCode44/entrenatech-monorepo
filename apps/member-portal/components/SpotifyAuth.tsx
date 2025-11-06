import React, { useState, useEffect } from 'react';
import { X, Spotify, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import spotifyService, { MusicServiceState } from '../services/music/spotifyService';

interface SpotifyAuthProps {
  onClose: () => void;
  onAuthenticated: (token: string) => void;
}

const SpotifyAuth: React.FC<SpotifyAuthProps> = ({ onClose, onAuthenticated }) => {
  const [authState, setAuthState] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [musicState, setMusicState] = useState<MusicServiceState | null>(null);

  // Spotify Web API credentials (you'll need to get these from Spotify Developer Dashboard)
  const CLIENT_ID = '86198490734e46d5a4959cd41cf27cea'; // Replace with your actual Client ID
  const REDIRECT_URI = `${window.location.origin}/member/spotify-callback`;
  const SCOPES = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'playlist-read-private',
    'playlist-read-collaborative',
    'streaming'
  ].join(' ');

  useEffect(() => {
    // Subscribe to Spotify service state changes
    spotifyService.onStateChange(setMusicState);

    return () => {
      spotifyService.offStateChange(setMusicState);
    };
  }, []);

  // Handle Spotify authentication
  const handleSpotifyAuth = () => {
    setAuthState('connecting');

    // Generate random state for security
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('spotify_auth_state', state);

    // Build authorization URL
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('response_type', 'token');
    authUrl.searchParams.append('client_id', CLIENT_ID);
    authUrl.searchParams.append('scope', SCOPES);
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('state', state);

    // Open Spotify auth in popup
    const popup = window.open(
      authUrl.toString(),
      'spotify-auth',
      'width=400,height=600,scrollbars=yes,resizable=yes'
    );

    // Listen for messages from popup
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'SPOTIFY_AUTH_SUCCESS') {
        const { token, state: returnedState } = event.data;

        // Verify state matches
        const storedState = localStorage.getItem('spotify_auth_state');
        if (returnedState !== storedState) {
          setAuthState('error');
          setErrorMessage('Error de autenticación: estado inválido');
          return;
        }

        // Clear stored state
        localStorage.removeItem('spotify_auth_state');

        // Initialize player with token
        initializePlayer(token);
        popup?.close();
      } else if (event.data.type === 'SPOTIFY_AUTH_ERROR') {
        setAuthState('error');
        setErrorMessage(event.data.error || 'Error desconocido');
        popup?.close();
      }
    };

    window.addEventListener('message', messageListener);

    // Cleanup
    return () => {
      window.removeEventListener('message', messageListener);
    };
  };

  // Initialize Spotify player
  const initializePlayer = async (token: string) => {
    try {
      setAuthState('connecting');
      const success = await spotifyService.initializePlayer(token);

      if (success) {
        setAuthState('success');
        onAuthenticated(token);

        // Auto close after success
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setAuthState('error');
        setErrorMessage('Error al inicializar el reproductor de Spotify');
      }
    } catch (error) {
      setAuthState('error');
      setErrorMessage('Error al conectar con Spotify');
      console.error('Spotify initialization error:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md">
        <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 hover:bg-zinc-100 transition-colors"
          >
            <X className="h-5 w-5 text-zinc-500" />
          </button>

          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
              <Spotify className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Conectar Spotify</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Conecta tu cuenta de Spotify para disfrutar de música personalizada durante tus entrenamientos
            </p>
          </div>

          {/* States */}
          {authState === 'idle' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-zinc-50 p-4">
                <h4 className="font-semibold text-zinc-900 mb-2">¿Qué obtienes?</h4>
                <ul className="space-y-2 text-sm text-zinc-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Acceso a toda tu música</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Playlists personalizadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Control completo del reproductor</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Música adaptada a tu entrenamiento</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleSpotifyAuth}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600 transition-colors"
              >
                <Spotify className="h-5 w-5" />
                Conectar con Spotify
              </button>

              <p className="text-center text-xs text-zinc-500">
                Serás redirigido a Spotify para autorizar el acceso
              </p>
            </div>
          )}

          {authState === 'connecting' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-green-500" />
                <p className="mt-4 text-lg font-semibold text-zinc-900">Conectando con Spotify...</p>
                <p className="text-sm text-zinc-600">Esto solo tomará unos segundos</p>
              </div>

              {musicState && (
                <div className="rounded-lg bg-zinc-50 p-4">
                  <h4 className="font-semibold text-zinc-900 mb-2">Estado:</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-zinc-600">
                      Conectado: {musicState.isConnected ? '✅' : '⏳'}
                    </p>
                    <p className="text-zinc-600">
                      Dispositivo: {musicState.deviceId ? '✅' : '⏳'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {authState === 'success' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="mt-4 text-lg font-bold text-zinc-900">¡Conexión Exitosa!</p>
                <p className="text-sm text-zinc-600">Tu Spotify está conectado y listo</p>
              </div>

              {musicState?.currentTrack && (
                <div className="rounded-lg bg-zinc-50 p-4">
                  <h4 className="font-semibold text-zinc-900 mb-2">Reproduciendo:</h4>
                  <p className="text-sm text-zinc-600">{musicState.currentTrack.name}</p>
                  <p className="text-xs text-zinc-500">
                    {musicState.currentTrack.artists.map(a => a.name).join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}

          {authState === 'error' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <p className="mt-4 text-lg font-bold text-zinc-900">Error de Conexión</p>
                <p className="text-sm text-zinc-600 text-center px-4">{errorMessage}</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleSpotifyAuth}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600 transition-colors"
                >
                  <Spotify className="h-5 w-5" />
                  Intentar de Nuevo
                </button>

                <button
                  onClick={onClose}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-6 py-3 font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>

              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <h4 className="font-semibold text-amber-900 mb-2 text-sm">Solución:</h4>
                <ul className="space-y-1 text-xs text-amber-800">
                  <li>• Asegúrate de tener Spotify Premium</li>
                  <li>• Verifica tu conexión a internet</li>
                  <li>• Intenta recargar la página</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotifyAuth;