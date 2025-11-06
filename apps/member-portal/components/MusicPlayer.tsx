import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle,
  ChevronDown, ChevronUp, Music, Heart, ListMusic, Radio, SkipForwardIcon,
  X, Search, Mic2, Wifi, WifiOff, Maximize2, Minimize2,
  BarChart3, Activity, Zap, Users, TrendingUp, Clock,
  MoreHorizontal, Plus, ChevronRight, Eye, EyeOff
} from 'lucide-react';
import spotifyService, { MusicServiceState, SpotifyTrack, SpotifyPlaylist } from '../services/music/spotifyService';
import SpotifyAuth from './SpotifyAuth';

interface QueueItem {
  track: SpotifyTrack;
  addedAt: Date;
  addedBy: 'You' | 'Spotify';
}

interface MusicVisualizerProps {
  isPlaying: boolean;
  track: SpotifyTrack | null;
}

const MusicVisualizer: React.FC<MusicVisualizerProps> = ({ isPlaying, track }) => {
  const [bars, setBars] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(20).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setBars(prev =>
        prev.map(() => Math.random() * 100)
      );
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex items-end justify-center gap-1 h-20">
      {bars.map((height, index) => (
        <div
          key={index}
          className="w-1 bg-gradient-to-t from-green-400 to-green-600 rounded-full transition-all duration-150 ease-out"
          style={{
            height: `${height}%`,
            opacity: isPlaying ? 0.8 : 0.3,
            transform: `scaleY(${height / 100})`
          }}
        />
      ))}
    </div>
  );
};

const MusicPlayer: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpotifyAuth, setShowSpotifyAuth] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [showUserPlaylists, setShowUserPlaylists] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'track' | 'context'>('off');
  const [isShuffled, setIsShuffled] = useState(false);
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());

  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const handleSearch = async (query: string) => {
    if (!query.trim() || !musicState.isConnected) return;

    setIsSearching(true);
    try {
      console.log('🔍 Searching for:', query);
      const results = await spotifyService.searchTracks(query);
      console.log('🎵 Search results:', results.length, 'tracks found');
      setSearchResults(results);

      // Add to queue if not already there
      results.forEach(track => {
        if (!queue.find(item => item.track.id === track.id)) {
          setQueue(prev => [...prev, {
            track,
            addedAt: new Date(),
            addedBy: 'You'
          }]);
        }
      });
    } catch (error) {
      console.error('❌ Error searching:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const playTrack = async (trackUri: string) => {
    try {
      console.log('🎵 Playing track:', trackUri);
      await spotifyService.playTrack(trackUri);
      setSearchResults([]); // Clear search results after playing
      setShowSearch(false); // Hide search after playing
    } catch (error) {
      console.error('❌ Error playing track:', error);
    }
  };

  const loadUserLibrary = async () => {
    console.log('📚 Loading user library...');
    try {
      await spotifyService.loadUserLibraryPublic();
    } catch (error) {
      console.error('❌ Error loading library:', error);
    }
  };

  const loadWorkoutPlaylist = async () => {
    console.log('🏋️ Loading workout playlist...');
    try {
      await spotifyService.playPlaylist('spotify:playlist:37i9dQZF1DX0XUsuxWHRQd');
    } catch (error) {
      console.error('❌ Error loading workout playlist:', error);
    }
  };

  const loadMyPlaylists = async () => {
    console.log('📋 Loading user playlists...');
    try {
      const playlists = await spotifyService.getUserPlaylists();
      console.log('📋 Found', playlists.length, 'user playlists');
      setUserPlaylists(playlists);
      setShowUserPlaylists(true);
    } catch (error) {
      console.error('❌ Error loading playlists:', error);
      setUserPlaylists([]);
    }
  };

  const clearSearchResults = () => {
    setSearchResults([]);
  };

  const toggleLike = (trackId: string) => {
    setLikedSongs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const progressPercentage = musicState.currentTrack
    ? (musicState.position / musicState.currentTrack.duration_ms) * 100
    : 0;

  // MINIMIZED PLAYER
  if (isMinimized && !isFullscreen) {
    return (
      <div
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-0 left-0 right-0 z-20 mx-auto max-w-md cursor-pointer px-4 pb-16"
      >
        <div className="flex items-center gap-3 rounded-t-xl bg-black/95 p-3 shadow-lg backdrop-blur-xl hover:bg-black/90 transition-all">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-black shadow-md hover:scale-105 transition-all"
          >
            {musicState.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-white">
              {musicState.currentTrack?.name || 'EntrenaTech Music'}
            </p>
            <p className="truncate text-xs text-zinc-400">
              {musicState.currentTrack?.artists.map(a => a.name).join(', ') ||
               (musicState.isConnected ? 'Selecciona música' : 'Conecta Spotify')}
            </p>
          </div>
          {musicState.isConnected ? (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs text-green-400">Premium</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Music className="h-4 w-4 text-zinc-400" />
              <span className="text-xs text-zinc-400">Offline</span>
            </div>
          )}
          <ChevronUp className="h-4 w-4 text-zinc-400" />
        </div>
      </div>
    );
  }

  // FULLSCREEN MODE
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <button
            onClick={() => setIsFullscreen(false)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <Minimize2 className="h-5 w-5" />
            <span className="text-sm">Salir de pantalla completa</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowVisualizer(!showVisualizer)}
              className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
            >
              {showVisualizer ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setShowQueue(!showQueue)}
              className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
            >
              <ListMusic className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-120px)]">
          {/* Left Side - Album Art and Visualizer */}
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            {showVisualizer && (
              <div className="mb-8">
                <MusicVisualizer isPlaying={musicState.isPlaying} track={musicState.currentTrack} />
              </div>
            )}

            <div className="w-96 h-96 rounded-2xl shadow-2xl overflow-hidden group">
              {musicState.currentTrack?.album?.images?.[0]?.url ? (
                <img
                  src={musicState.currentTrack.album.images[0].url}
                  alt={musicState.currentTrack.album.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
                  <Music className="h-32 w-32 text-zinc-400" />
                </div>
              )}
            </div>

            <div className="mt-8 text-center max-w-2xl">
              <h1 className="text-4xl font-bold mb-2">
                {musicState.currentTrack?.name || 'Selecciona una canción'}
              </h1>
              <p className="text-xl text-zinc-300 mb-1">
                {musicState.currentTrack?.artists.map(a => a.name).join(', ') || 'Conecta Spotify'}
              </p>
              <p className="text-lg text-zinc-400">
                {musicState.currentTrack?.album.name} • {Math.round((musicState.currentTrack?.duration_ms || 0) / 60000)} min
              </p>
            </div>
          </div>

          {/* Right Side - Queue */}
          {showQueue && (
            <div className="w-96 bg-zinc-800/50 backdrop-blur-lg p-6 border-l border-zinc-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ListMusic className="h-6 w-6" />
                Cola de reproducción
              </h3>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {queue.length > 0 ? (
                  queue.map((item, index) => (
                    <div
                      key={`${item.track.id}-${index}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-700/50 transition-colors"
                    >
                      <span className="text-zinc-400 text-sm w-6">{index + 1}</span>
                      <img
                        src={item.track.album?.images?.[2]?.url || ''}
                        alt={item.track.name}
                        className="h-10 w-10 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.track.name}</p>
                        <p className="text-xs text-zinc-400 truncate">
                          {item.track.artists.map(a => a.name).join(', ')}
                        </p>
                      </div>
                      <span className="text-xs text-zinc-500">
                        {item.addedBy === 'You' ? 'Tú' : 'Spotify'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-zinc-400">
                    <ListMusic className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No hay canciones en la cola</p>
                    <p className="text-sm mt-2">Busca y añade música para empezar</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Controls Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-zinc-800">
          <div className="max-w-6xl mx-auto p-6">
            {/* Progress Bar */}
            <div
              className="mb-4 h-2 overflow-hidden rounded-full bg-zinc-700 cursor-pointer group"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all group-hover:h-3"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-400 mb-6">
              <span>{formatTime(musicState.position)}</span>
              <span>{musicState.currentTrack ? formatTime(musicState.currentTrack.duration_ms) : '0:00'}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={() => setRepeatMode(prev =>
                  prev === 'off' ? 'context' : prev === 'context' ? 'track' : 'off'
                )}
                className={`p-2 rounded-full transition-colors ${
                  repeatMode !== 'off' ? 'text-green-400' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Repeat className={`h-5 w-5 ${repeatMode === 'track' ? 'scale-x-[-1]' : ''}`} />
              </button>

              <button
                onClick={() => setIsShuffled(!isShuffled)}
                className={`p-2 rounded-full transition-colors ${
                  isShuffled ? 'text-green-400' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Shuffle className="h-5 w-5" />
              </button>

              <button
                onClick={handlePrevious}
                className="p-3 rounded-full hover:bg-zinc-800 transition-colors disabled:opacity-50"
                disabled={!musicState.isConnected}
              >
                <SkipBack className="h-6 w-6" />
              </button>

              <button
                onClick={togglePlay}
                className="p-4 rounded-full bg-white text-black shadow-lg hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
                disabled={!musicState.isConnected && !spotifyToken}
              >
                {musicState.isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
              </button>

              <button
                onClick={handleNext}
                className="p-3 rounded-full hover:bg-zinc-800 transition-colors disabled:opacity-50"
                disabled={!musicState.isConnected}
              >
                <SkipForward className="h-6 w-6" />
              </button>

              <button
                onClick={() => musicState.currentTrack && toggleLike(musicState.currentTrack.id)}
                className="p-2 rounded-full transition-colors"
              >
                <Heart
                  className={`h-5 w-5 ${
                    musicState.currentTrack && likedSongs.has(musicState.currentTrack.id)
                      ? 'text-green-400 fill-green-400'
                      : 'text-zinc-400 hover:text-white hover:fill-zinc-400'
                  }`}
                />
              </button>

              <div className="flex items-center gap-3">
                <Volume2 className="h-5 w-5 text-zinc-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={musicState.volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer hover:h-1.5 transition-all"
                  style={{
                    background: `linear-gradient(to right, white 0%, white ${musicState.volume * 100}%, rgb(113, 113, 122) ${musicState.volume * 100}%, rgb(113, 113, 122) 100%)`
                  }}
                  disabled={!musicState.isConnected}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NORMAL MODE
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-20 mx-auto max-w-4xl px-4 pb-16">
        <div className="relative rounded-t-3xl border-t border-x border-zinc-200 bg-black/98 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="mb-4 px-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                  <Music className="h-4 w-4 text-black" />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">EntrenaTech Music</span>
                  {musicState.currentTrack && (
                    <p className="text-xs text-zinc-400">Reproduciendo ahora</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Connection Status */}
                {musicState.isConnected ? (
                  <div className="flex items-center gap-1 text-green-400">
                    <Wifi className="h-4 w-4" />
                    <span className="text-xs">Premium</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSpotifyAuth(true)}
                    className="flex items-center gap-1 text-zinc-400 hover:text-white"
                  >
                    <WifiOff className="h-4 w-4" />
                    <span className="text-xs">Conectar</span>
                  </button>
                )}

                {/* Action Buttons */}
                <button
                  onClick={() => setShowQueue(!showQueue)}
                  className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                >
                  <ListMusic className="h-4 w-4 text-zinc-400" />
                </button>

                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                >
                  <Search className="h-4 w-4 text-zinc-400" />
                </button>

                <button
                  onClick={() => setIsFullscreen(true)}
                  className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                >
                  <Maximize2 className="h-4 w-4 text-zinc-400" />
                </button>

                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 hover:bg-zinc-800 rounded transition-colors"
                >
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Visualizer */}
          {showVisualizer && musicState.isConnected && (
            <div className="mb-4 px-4">
              <MusicVisualizer isPlaying={musicState.isPlaying} track={musicState.currentTrack} />
            </div>
          )}

          {/* Search Panel */}
          {showSearch && musicState.isConnected && (
            <div className="mb-4 px-4">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="🔍 Buscar canciones, artistas, podcasts..."
                  className="w-full rounded-full bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e.target.value);
                    }
                  }}
                  disabled={isSearching}
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-white"></div>
                  </div>
                )}
                {searchResults.length > 0 && !isSearching && (
                  <div className="absolute top-full mt-2 w-full bg-zinc-800 rounded-lg shadow-xl max-h-64 overflow-y-auto z-30">
                    {searchResults.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => playTrack(track.uri)}
                        className="w-full text-left px-4 py-3 hover:bg-zinc-700 transition-colors flex items-center gap-3 border-b border-zinc-700 last:border-b-0"
                      >
                        {track.album?.images?.[2]?.url ? (
                          <img
                            src={track.album.images[2].url}
                            alt={track.name}
                            className="h-10 w-10 rounded"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-zinc-600 flex items-center justify-center">
                            <Music className="h-5 w-5 text-zinc-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate">{track.name}</p>
                          <p className="text-xs text-zinc-400 truncate">{track.artists.map(a => a.name).join(', ')}</p>
                        </div>
                        <span className="text-xs text-zinc-500">
                          {Math.round(track.duration_ms / 60000)}:{String(Math.round((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Album Art and Track Info */}
          <div className="mb-6 px-4">
            <div className="flex gap-6">
              {/* Album Art */}
              <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl shadow-xl group">
                {musicState.currentTrack?.album?.images?.[1]?.url ? (
                  <img
                    src={musicState.currentTrack.album.images[1].url}
                    alt={musicState.currentTrack.album.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-900">
                    <Music className="h-12 w-12 text-zinc-400" />
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="flex-1 overflow-hidden">
                <h3 className="mb-2 text-xl font-bold text-white truncate">
                  {musicState.currentTrack?.name || 'Selecciona una canción'}
                </h3>
                <p className="text-base text-zinc-300 truncate mb-4">
                  {musicState.currentTrack?.artists.map(a => a.name).join(', ') ||
                   (musicState.isConnected ? 'Conecta tu cuenta para empezar' : 'Conecta Spotify')}
                </p>

                {/* Album Info */}
                {musicState.currentTrack && (
                  <div className="mb-4">
                    <p className="text-sm text-zinc-400 truncate">
                      {musicState.currentTrack.album.name} • {Math.round(musicState.currentTrack.duration_ms / 60000)} min
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                {musicState.currentTrack && (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(musicState.currentTrack!.id)}
                      className="text-zinc-400 hover:text-green-400 transition-colors"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          likedSongs.has(musicState.currentTrack!.id)
                            ? 'fill-green-400 text-green-400'
                            : ''
                        }`}
                      />
                    </button>
                    <button className="text-zinc-400 hover:text-white transition-colors">
                      <ListMusic className="h-5 w-5" />
                    </button>
                    <button className="text-zinc-400 hover:text-white transition-colors">
                      <Radio className="h-5 w-5" />
                    </button>
                    <button className="text-zinc-400 hover:text-white transition-colors">
                      <SkipForwardIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {musicState.currentTrack && (
            <div className="mb-4 px-4">
              <div
                className="mb-2 h-1.5 overflow-hidden rounded-full bg-zinc-700 cursor-pointer group"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all group-hover:h-2"
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
          <div className="mb-4 flex items-center justify-center gap-6 px-4">
            <button
              onClick={() => setRepeatMode(prev =>
                prev === 'off' ? 'context' : prev === 'context' ? 'track' : 'off'
              )}
              className={`p-2 rounded-full transition-colors ${
                repeatMode !== 'off' ? 'text-green-400' : 'text-zinc-400 hover:text-white'
              }`}
              disabled={!musicState.isConnected}
            >
              <Repeat className={`h-4 w-4 ${repeatMode === 'track' ? 'scale-x-[-1]' : ''}`} />
            </button>

            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className={`p-2 rounded-full transition-colors ${
                isShuffled ? 'text-green-400' : 'text-zinc-400 hover:text-white'
              }`}
              disabled={!musicState.isConnected}
            >
              <Shuffle className="h-4 w-4" />
            </button>

            <button
              onClick={handlePrevious}
              className="text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
              disabled={!musicState.isConnected}
            >
              <SkipBack className="h-5 w-5" />
            </button>

            <button
              onClick={togglePlay}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
              disabled={!musicState.isConnected && !spotifyToken}
            >
              {musicState.isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
            </button>

            <button
              onClick={handleNext}
              className="text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
              disabled={!musicState.isConnected}
            >
              <SkipForward className="h-5 w-5" />
            </button>

            <button
              onClick={() => musicState.currentTrack && toggleLike(musicState.currentTrack.id)}
              className="text-zinc-400 hover:text-green-400 transition-colors"
            >
              <Heart
                className={`h-5 w-5 ${
                  musicState.currentTrack && likedSongs.has(musicState.currentTrack.id)
                    ? 'fill-green-400 text-green-400'
                    : ''
                }`}
              />
            </button>
          </div>

          {/* Volume */}
          <div className="mb-4 flex items-center gap-3 px-4">
            <Volume2 className="h-4 w-4 text-zinc-400" />
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={musicState.volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-zinc-600 rounded-lg appearance-none cursor-pointer hover:h-2 transition-all"
                style={{
                  background: `linear-gradient(to right, white 0%, white ${musicState.volume * 100}%, rgb(113, 113, 122) ${musicState.volume * 100}%, rgb(113, 113, 122) 100%)`
                }}
                disabled={!musicState.isConnected}
              />
            </div>
            <span className="text-xs text-zinc-400 w-8 text-right">
              {Math.round(musicState.volume * 100)}
            </span>
          </div>

          {/* Quick Actions */}
          {musicState.isConnected && (
            <div className="mb-4 px-4 space-y-3">
              <button
                onClick={() => loadUserLibrary()}
                className="w-full rounded-full bg-white px-4 py-3 text-sm font-medium text-black hover:bg-zinc-200 transition-all"
              >
                📚 Mi Música Guardada
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => loadWorkoutPlaylist()}
                  className="rounded-full border border-zinc-600 px-3 py-2 text-xs font-medium text-zinc-300 hover:border-zinc-500 hover:text-white hover:bg-zinc-700 transition-all"
                >
                  🏋️ Entrenamiento
                </button>
                <button
                  onClick={() => spotifyService.playPlaylist('spotify:playlist:37i9dQZF1DXcBWIGoYBM5M')}
                  className="rounded-full border border-zinc-600 px-3 py-2 text-xs font-medium text-zinc-300 hover:border-zinc-500 hover:text-white hover:bg-zinc-700 transition-all"
                >
                  🔥 Top Hits
                </button>
                <button
                  onClick={() => spotifyService.playPlaylist('spotify:playlist:37i9dQZF1DX4PP3DA4J0N8')}
                  className="rounded-full border border-zinc-600 px-3 py-2 text-xs font-medium text-zinc-300 hover:border-zinc-500 hover:text-white hover:bg-zinc-700 transition-all"
                >
                  🎸 Rock Clásico
                </button>
                <button
                  onClick={() => spotifyService.playPlaylist('spotify:playlist:37i9dQZF1DXbXWp7klea1')}
                  className="rounded-full border border-zinc-600 px-3 py-2 text-xs font-medium text-zinc-300 hover:border-zinc-500 hover:text-white hover:bg-zinc-700 transition-all"
                >
                  🎶 Pop
                </button>
              </div>

              <button
                onClick={() => loadMyPlaylists()}
                className="w-full rounded-full border border-zinc-600 px-3 py-2 text-xs font-medium text-zinc-300 hover:border-zinc-500 hover:text-white hover:bg-zinc-700 transition-all"
              >
                📋 Cargar mis playlists
              </button>
            </div>
          )}

          {/* Connect Button */}
          {!musicState.isConnected && (
            <div className="px-4 pb-4">
              <button
                onClick={() => setShowSpotifyAuth(true)}
                className="w-full rounded-full bg-green-500 px-4 py-3 text-sm font-medium text-white hover:bg-green-600 transition-all"
              >
                🎵 Conectar Spotify
              </button>
              <p className="mt-2 text-center text-xs text-zinc-400">
                Se requiere Spotify Premium para reproducción
              </p>
            </div>
          )}
        </div>

        {/* Queue Sidebar */}
        {showQueue && (
          <div className="fixed right-0 top-0 h-full w-96 bg-zinc-900/95 backdrop-blur-xl border-l border-zinc-700 z-30 transform transition-transform duration-300">
            <div className="p-6 border-b border-zinc-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ListMusic className="h-5 w-5" />
                  Cola de reproducción
                </h3>
                <button
                  onClick={() => setShowQueue(false)}
                  className="p-1 rounded-full hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-5 w-5 text-zinc-400" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto">
                {queue.length > 0 ? (
                  queue.map((item, index) => (
                    <div
                      key={`${item.track.id}-${index}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                      <span className="text-zinc-400 text-sm w-6">{index + 1}</span>
                      <img
                        src={item.track.album?.images?.[2]?.url || ''}
                        alt={item.track.name}
                        className="h-10 w-10 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.track.name}</p>
                        <p className="text-xs text-zinc-400 truncate">
                          {item.track.artists.map(a => a.name).join(', ')}
                        </p>
                      </div>
                      <span className="text-xs text-zinc-500">
                        {item.addedBy === 'You' ? 'Tú' : 'Spotify'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-zinc-400">
                    <ListMusic className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No hay canciones en la cola</p>
                    <p className="text-sm mt-2">Usa la búsqueda para añadir música</p>
                  </div>
                )}
              </div>
            </div>
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

      {/* User Playlists Modal */}
      {showUserPlaylists && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl">
              {/* Close button */}
              <button
                onClick={() => setShowUserPlaylists(false)}
                className="absolute right-4 top-4 rounded-full p-1 hover:bg-zinc-100 transition-colors"
              >
                <X className="h-5 w-5 text-zinc-500" />
              </button>

              {/* Header */}
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
                  <ListMusic className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900">Mis Playlists</h3>
                <p className="mt-2 text-sm text-zinc-600">
                  Selecciona una playlist para reproducir
                </p>
              </div>

              {/* Playlists List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {userPlaylists.length > 0 ? (
                  userPlaylists.map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => {
                        spotifyService.playPlaylist(playlist.uri);
                        setShowUserPlaylists(false);
                      }}
                      className="w-full text-left p-3 rounded-lg hover:bg-zinc-50 transition-colors flex items-center gap-3"
                    >
                      {playlist.images?.[0]?.url ? (
                        <img
                          src={playlist.images[0].url}
                          alt={playlist.name}
                          className="h-12 w-12 rounded"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded bg-zinc-200 flex items-center justify-center">
                          <ListMusic className="h-6 w-6 text-zinc-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 truncate">{playlist.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{playlist.description}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ListMusic className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
                    <p className="text-zinc-500">No tienes playlists disponibles</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicPlayer;