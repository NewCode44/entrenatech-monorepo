import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Music2, ChevronDown, ChevronUp, Music } from 'lucide-react';
import spotifyService, { MusicServiceState, SpotifyTrack } from '../services/music/spotifyService';
import SpotifyAuth from './SpotifyAuth';

const MusicPlayer: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [showSpotifyAuth, setShowSpotifyAuth] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [musicState, setMusicState] = useState<MusicServiceState>({
  isPlaying: false,
  currentTrack: null,
  currentPlaylist: null,
  volume: 0.75,
  position: 0,
  duration: 0,
  isConnected: false,
  deviceId: null
});

  useEffect(() => {
    // Clear any old mock data that might be cached
    localStorage.removeItem('mock_music_state');
    localStorage.removeItem('current_track');

    // Reset service state to ensure clean start
    const currentState = spotifyService.getState();
    if (currentState.currentTrack || currentState.isPlaying) {
      console.log('Clearing old music state...');
      // Force reset the service state
      setMusicState({
        isPlaying: false,
        currentTrack: null,
        currentPlaylist: null,
        volume: 0.75,
        position: 0,
        duration: 0,
        isConnected: false,
        deviceId: null
      });
    }

    // Load stored Spotify token
    const storedToken = localStorage.getItem('spotify_token');
    if (storedToken) {
      setSpotifyToken(storedToken);
      initializeWithToken(storedToken);
    }

    // Subscribe to state changes
    const handleStateChange = (state: MusicServiceState) => {
      setMusicState(state);
    };

    spotifyService.onStateChange(handleStateChange);

    return () => {
      spotifyService.offStateChange(handleStateChange);
    };
  }, []);

  const initializeWithToken = async (token: string) => {
    try {
      await spotifyService.initializePlayer(token);
    } catch (error) {
      console.error('Error initializing Spotify:', error);
      // If initialization fails, clear token and show auth
      localStorage.removeItem('spotify_token');
      setSpotifyToken(null);
    }
  };

  const handleSpotifyAuthenticated = (token: string) => {
    setSpotifyToken(token);
    localStorage.setItem('spotify_token', token);
    setShowSpotifyAuth(false);
  };

  const togglePlay = async () => {
    console.log('togglePlay clicked, isConnected:', musicState.isConnected);
    if (!musicState.isConnected) {
      console.log('Opening Spotify auth modal...');
      setShowSpotifyAuth(true);
      return;
    }

    await spotifyService.togglePlay();
  };

  const handleNext = async () => {
    if (musicState.isConnected) {
      await spotifyService.nextTrack();
    }
  };

  const handlePrevious = async () => {
    if (musicState.isConnected) {
      await spotifyService.previousTrack();
    }
  };

  const handleVolumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    if (musicState.isConnected) {
      await spotifyService.setVolume(volume);
    }
  };

  const handleProgressClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!musicState.currentTrack || !musicState.isConnected) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekTime = musicState.currentTrack.duration_ms * percentage;

    await spotifyService.seek(seekTime);
  };

  const formatTime = (ms: number) => {
    return spotifyService.formatTime(ms);
  };

  const progressPercentage = musicState.currentTrack
    ? (musicState.position / musicState.currentTrack.duration_ms) * 100
    : 0;

  if (isMinimized) {
    return (
      <div
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-0 left-0 right-0 z-20 mx-auto max-w-md cursor-pointer px-4 pb-16"
      >
        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white/95 p-3 shadow-lg backdrop-blur-xl hover:border-cyan-300 hover:shadow-xl transition-all">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md"
          >
            {musicState.isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </button>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold text-zinc-900">
              {musicState.currentTrack?.name || 'Conecta Spotify'}
            </p>
            <p className="truncate text-xs text-zinc-500">
              {musicState.currentTrack?.artists.map(a => a.name).join(', ') || 'Sin conexión'}
            </p>
          </div>
          {musicState.isConnected ? (
            <div className="flex items-center gap-1 text-green-500">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          ) : (
            <Music className="h-5 w-5 text-zinc-400" />
          )}
          <ChevronUp className="h-5 w-5 text-zinc-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 mx-auto max-w-md px-4 pb-16">
      <div className="relative rounded-2xl border border-zinc-200 bg-white/95 p-5 shadow-2xl backdrop-blur-xl">
        {/* BOTÓN MINIMIZAR */}
        <div className="mb-3 flex justify-end">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMinimized(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-white shadow-lg hover:from-cyan-400 hover:to-blue-400 transition-all font-semibold text-sm active:scale-95"
          >
            <ChevronDown className="h-5 w-5" />
            Minimizar
          </button>
        </div>

        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <Music2 className="h-5 w-5 text-cyan-600" />
          <h3 className="text-sm font-semibold text-zinc-900">Reproduciendo</h3>
        </div>

        {/* Album Art */}
        <div className="mb-4 overflow-hidden rounded-xl">
          {musicState.currentTrack?.album?.images?.[0]?.url ? (
            <img
              src={musicState.currentTrack.album.images[0].url}
              alt={musicState.currentTrack.album.name}
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-700">
              {musicState.isConnected ? (
                <Music className="h-20 w-20 text-white" />
              ) : (
                <Music2 className="h-20 w-20 text-white" />
              )}
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="mb-4 text-center">
          <h4 className="mb-1 font-semibold text-zinc-900">
            {musicState.currentTrack?.name || 'Sin reproducción'}
          </h4>
          <p className="text-sm text-zinc-500">
            {musicState.currentTrack?.artists.map(a => a.name).join(', ') ||
             (musicState.isConnected ? 'Conectado' : 'Conecta tu cuenta')}
          </p>
        </div>

        {/* Progress Bar */}
        {musicState.currentTrack && (
          <div className="mb-4">
            <div
              className="mb-2 h-1 overflow-hidden rounded-full bg-zinc-200 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-400">
              <span>{formatTime(musicState.position)}</span>
              <span>{formatTime(musicState.currentTrack.duration_ms)}</span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mb-4 flex items-center justify-center gap-4">
          <button className="text-zinc-400 hover:text-cyan-600 transition-colors">
            <Shuffle className="h-4 w-4" />
          </button>
          <button
            onClick={handlePrevious}
            className="text-zinc-400 hover:text-zinc-900 transition-colors disabled:opacity-50"
            disabled={!musicState.isConnected}
          >
            <SkipBack className="h-6 w-6" />
          </button>
          <button
            onClick={togglePlay}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all active:scale-95 disabled:opacity-50"
            disabled={!musicState.isConnected && !spotifyToken}
          >
            {musicState.isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
          </button>
          <button
            onClick={handleNext}
            className="text-zinc-400 hover:text-zinc-900 transition-colors disabled:opacity-50"
            disabled={!musicState.isConnected}
          >
            <SkipForward className="h-6 w-6" />
          </button>
          <button className="text-zinc-400 hover:text-cyan-600 transition-colors">
            <Repeat className="h-4 w-4" />
          </button>
        </div>

        {/* Volume */}
        <div className="mb-4 flex items-center gap-3">
          <Volume2 className="h-4 w-4 text-zinc-400" />
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={musicState.volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(6, 182, 212) 0%, rgb(6, 182, 212) ${musicState.volume * 100}%, rgb(229, 231, 235) ${musicState.volume * 100}%, rgb(229, 231, 235) 100%)`
              }}
              disabled={!musicState.isConnected}
            />
          </div>
        </div>

        {/* Service Status */}
        <div className="mb-4 rounded-lg bg-zinc-50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-zinc-700">Spotify</span>
            </div>
            <div className="flex items-center gap-2">
              {musicState.isConnected ? (
                <div className="flex items-center gap-1 text-green-600">
                  <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></div>
                  <span className="text-xs font-medium">Conectado</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowSpotifyAuth(true)}
                  className="text-xs font-medium text-cyan-600 hover:text-cyan-700"
                >
                  Conectar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {!musicState.isConnected && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowSpotifyAuth(true)}
              className="flex-1 rounded-lg border border-zinc-200 bg-white py-2 text-xs font-medium text-zinc-700 hover:border-cyan-300 hover:text-cyan-700 hover:bg-cyan-50 transition-colors"
            >
              Conectar Cuenta
            </button>
            <button
              onClick={() => window.open('https://www.spotify.com/premium', '_blank')}
              className="flex-1 rounded-lg border border-zinc-200 bg-white py-2 text-xs font-medium text-zinc-700 hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-colors"
            >
              Obtener Premium
            </button>
          </div>
        )}
      </div>

      {/* Spotify Auth Modal */}
      {showSpotifyAuth && (
        <SpotifyAuth
          onClose={() => setShowSpotifyAuth(false)}
          onAuthenticated={handleSpotifyAuthenticated}
        />
      )}
    </div>
  );
};

export default MusicPlayer;
