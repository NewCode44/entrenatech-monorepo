import React, { useEffect } from 'react';

const SpotifyCallback: React.FC = () => {
  console.log('SpotifyCallback component mounted!');

  useEffect(() => {
    console.log('SpotifyCallback useEffect triggered');
    console.log('Current URL:', window.location.href);
    console.log('Is popup:', !window.opener);

    // Parse URL parameters for authorization code
    const urlParams = new URLSearchParams(window.location.search);

    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    console.log('Callback params:', { code, state, error });

    // Get stored state and code verifier from localStorage
    const storedState = localStorage.getItem('spotify_auth_state');
    const codeVerifier = localStorage.getItem('spotify_code_verifier');

    console.log('Stored data:', { storedState, hasCodeVerifier: !!codeVerifier });

    if (error) {
      console.log('Error in callback:', error);
      // Send error to parent window
      window.opener?.postMessage({
        type: 'SPOTIFY_AUTH_ERROR',
        error: error
      }, window.location.origin);

      setTimeout(() => window.close(), 100);
      return;
    }

    if (!code || !state) {
      console.log('Missing code or state');
      window.opener?.postMessage({
        type: 'SPOTIFY_AUTH_ERROR',
        error: 'Missing authorization code or state'
      }, window.location.origin);

      setTimeout(() => window.close(), 100);
      return;
    }

    // Verify state matches
    if (state !== storedState) {
      console.log('State mismatch:', { state, storedState });
      window.opener?.postMessage({
        type: 'SPOTIFY_AUTH_ERROR',
        error: 'Invalid state'
      }, window.location.origin);

      setTimeout(() => window.close(), 100);
      return;
    }

    // Exchange authorization code for access token
    console.log('Starting code exchange...');
    exchangeCodeForToken(code, codeVerifier);
  }, []);

  const exchangeCodeForToken = async (code: string, codeVerifier: string | null) => {
    try {
      console.log('Starting token exchange...');
      const CLIENT_ID = '86198490734e46d5a4959cd41cf27cea';
      const REDIRECT_URI = `${window.location.origin}/member/spotify-callback`;

      console.log('Token exchange params:', { CLIENT_ID, REDIRECT_URI, hasCode: !!code, hasVerifier: !!codeVerifier });

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI,
          code_verifier: codeVerifier || ''
        })
      });

      console.log('Token exchange response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token exchange failed:', errorText);
        throw new Error(`Failed to exchange code for token: ${errorText}`);
      }

      const data = await response.json();
      const accessToken = data.access_token;

      console.log('Token exchange successful, has access token:', !!accessToken);

      // Send success message to parent window
      console.log('Sending success message to parent window...');
      window.opener?.postMessage({
        type: 'SPOTIFY_AUTH_SUCCESS',
        token: accessToken,
        state: localStorage.getItem('spotify_auth_state')
      }, window.location.origin);

      console.log('Message sent, closing popup...');
      // Close popup with delay
      setTimeout(() => window.close(), 500);
    } catch (error) {
      console.error('Error exchanging code for token:', error);

      // Send error to parent window
      window.opener?.postMessage({
        type: 'SPOTIFY_AUTH_ERROR',
        error: 'Failed to exchange authorization code for token'
      }, window.location.origin);

      setTimeout(() => window.close(), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700">
      <div className="text-center text-white">
        <div className="mb-4">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
        </div>
        <h1 className="text-2xl font-bold mb-2">🎵 Procesando autenticación de Spotify...</h1>
        <p className="text-green-100 mb-4">Por favor espera mientras verificamos tu autenticación</p>
        <div className="bg-white/10 rounded-lg p-4 max-w-md">
          <p className="text-sm text-green-100">
            URL: {window.location.href}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpotifyCallback;