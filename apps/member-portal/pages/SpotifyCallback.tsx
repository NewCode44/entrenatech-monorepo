import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Parse hash fragment for token
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get('access_token');
    const state = params.get('state');
    const error = params.get('error');

    // Get stored state from localStorage
    const storedState = localStorage.getItem('spotify_auth_state');

    if (error) {
      // Send error to parent window
      window.opener?.postMessage({
        type: 'SPOTIFY_AUTH_ERROR',
        error: error
      }, window.location.origin);

      window.close();
      return;
    }

    if (!accessToken || !state) {
      window.opener?.postMessage({
        type: 'SPOTIFY_AUTH_ERROR',
        error: 'Missing access token or state'
      }, window.location.origin);

      window.close();
      return;
    }

    // Verify state matches
    if (state !== storedState) {
      window.opener?.postMessage({
        type: 'SPOTIFY_AUTH_ERROR',
        error: 'Invalid state'
      }, window.location.origin);

      window.close();
      return;
    }

    // Send success message to parent window
    window.opener?.postMessage({
      type: 'SPOTIFY_AUTH_SUCCESS',
      token: accessToken,
      state: state
    }, window.location.origin);

    // Close popup
    window.close();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700">
      <div className="text-center text-white">
        <div className="mb-4">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Conectando con Spotify...</h1>
        <p className="text-green-100">Por favor espera mientras verificamos tu autenticación</p>
      </div>
    </div>
  );
};

export default SpotifyCallback;