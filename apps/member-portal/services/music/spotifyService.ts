// Spotify Web SDK Integration Service

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  duration_ms: number;
  uri: string;
  preview_url?: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string }>;
  tracks: {
    items: Array<{
      track: SpotifyTrack;
    }>;
  };
  uri: string;
}

export interface MusicServiceState {
  isPlaying: boolean;
  currentTrack: SpotifyTrack | null;
  currentPlaylist: SpotifyPlaylist | null;
  volume: number;
  position: number;
  duration: number;
  isConnected: boolean;
  deviceId: string | null;
}

class SpotifyService {
  private token: string | null = null;
  private player: any = null;
  private state: MusicServiceState = {
    isPlaying: false,
    currentTrack: null,
    currentPlaylist: null,
    volume: 0.75,
    position: 0,
    duration: 0,
    isConnected: false,
    deviceId: null
  };

  private stateChangeCallbacks: Array<(state: MusicServiceState) => void> = [];

  constructor() {
    this.loadSpotifySDK();
  }

  // Load Spotify Web Playback SDK
  private loadSpotifySDK() {
    if (!window.Spotify) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('Spotify SDK Ready');
    };
  }

  // Initialize Spotify Player
  async initializePlayer(token: string): Promise<boolean> {
    try {
      console.log('🎵 Initializing Spotify Player with token...');
      this.token = token;

      if (!window.Spotify) {
        console.error('❌ Spotify SDK not loaded');
        throw new Error('Spotify SDK not loaded');
      }

      console.log('✅ Spotify SDK loaded, creating player...');
      this.player = new window.Spotify.Player({
        name: 'EntrenaTech Fitness',
        getOAuthToken: (cb: (token: string) => void) => {
          console.log('🔑 Providing OAuth token to Spotify SDK');
          cb(token);
        },
        volume: this.state.volume
      });

      // Event listeners
      this.player.addListener('ready', async ({ device_id }: { device_id: string }) => {
        console.log('🎯 Spotify Player Ready with device ID:', device_id);
        this.state.deviceId = device_id;
        this.state.isConnected = true;

        // Check user profile and try to load content from user's library when ready
        try {
          console.log('👤 Checking user profile...');
          await this.checkUserProfile();

          console.log('🎵 Attempting to load user library...');
          await this.loadUserLibrary();
        } catch (error) {
          console.log('⚠️ Could not load user library:', error);
        }

        this.notifyStateChange();
      });

      this.player.addListener('player_state_changed', (state: any) => {
        if (state) {
          console.log('🎧 Player state changed:', {
            track: state.track?.name,
            isPlaying: !state.paused,
            position: state.position,
            duration: state.duration
          });
          this.updatePlayerState(state);
        }
      });

      this.player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('⚠️ Device ID is offline:', device_id);
      });

      this.player.addListener('initialization_error', ({ message }: { message: string }) => {
        console.error('❌ Failed to initialize:', message);
      });

      this.player.addListener('authentication_error', ({ message }: { message: string }) => {
        console.error('❌ Failed to authenticate:', message);
      });

      this.player.addListener('playback_error', ({ message }: { message: string }) => {
        console.error('❌ Playback error:', message);
      });

      console.log('🚀 Connecting to Spotify...');
      const connected = await this.player.connect();
      console.log(connected ? '✅ Spotify player connected successfully' : '❌ Failed to connect Spotify player');

      return connected;

    } catch (error) {
      console.error('❌ Error initializing Spotify player:', error);
      return false;
    }
  }

  // Update player state
  private updatePlayerState(state: any) {
    const { track, position, duration, paused } = state;

    this.state.currentTrack = {
      id: track.id,
      name: track.name,
      artists: track.artists,
      album: track.album,
      duration_ms: track.duration_ms,
      uri: track.uri,
      preview_url: track.preview_url
    };

    this.state.position = position;
    this.state.duration = duration;
    this.state.isPlaying = !paused;

    this.notifyStateChange();
  }

  // Check user profile and Premium status
  async checkUserProfile(): Promise<void> {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (response.ok) {
        const profile = await response.json();
        console.log('👤 User Profile:', {
          id: profile.id,
          display_name: profile.display_name,
          country: profile.country,
          product: profile.product, // This will show 'premium' if you have Premium
          explicit_content: profile.explicit_content
        });

        if (profile.product !== 'premium') {
          console.warn('⚠️ User does not have Premium. Product:', profile.product);
        } else {
          console.log('✅ User has Premium subscription!');
        }
      } else {
        console.error('❌ Failed to get user profile:', response.status);
      }
    } catch (error) {
      console.error('❌ Error checking user profile:', error);
    }
  }

  // Load user's library or playlist to enable playback
  async loadUserLibrary(): Promise<void> {
    try {
      // First try to play user's saved tracks (likes)
      console.log('💿 Loading user saved tracks...');

      const response = await fetch(`https://api.spotify.com/v1/me/tracks?limit=1`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const trackUri = data.items[0].track.uri;
          console.log('🎵 Found user track:', data.items[0].track.name);
          await this.playTrack(trackUri);
        } else {
          console.log('📀 No saved tracks, trying playlist context...');
          // Try to play a context instead of specific track
          await this.playPlaylist('spotify:playlist:37i9dQZF1DXcBWIGoYBM5M'); // Today's Top Hits
        }
      } else {
        console.log('📀 Could not get saved tracks, trying workout playlist...');
        await this.playPlaylist('spotify:playlist:37i9dQZF1DX0XUsuxWHRQd'); // Workout playlist
      }
    } catch (error) {
      console.error('❌ Error loading user library:', error);
      // Fallback to a known working playlist
      try {
        await this.playPlaylist('spotify:playlist:37i9dQZF1DX4PP3DA4J0N8'); // Rock Classics
      } catch (fallbackError) {
        console.error('❌ Even fallback playlist failed:', fallbackError);
      }
    }
  }

  // Play a demo track for testing
  async playDemoTrack(): Promise<boolean> {
    try {
      // Use a different popular track that should be more widely available
      const demoTrackUri = 'spotify:track:4cOdK2wGLETOMsVvYiG5QI'; // Different track

      if (!this.state.deviceId) {
        throw new Error('Player not ready');
      }

      console.log('🎵 Playing demo track:', demoTrackUri);

      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.state.deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          uris: [demoTrackUri]
        })
      });

      console.log('🎵 Demo track response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🎵 Demo track error response:', errorText);
      }

      return response.ok;
    } catch (error) {
      console.error('❌ Error playing demo track:', error);
      return false;
    }
  }

  // Play a track
  async playTrack(trackUri: string): Promise<boolean> {
    try {
      if (!this.state.deviceId) {
        throw new Error('Player not ready');
      }

      console.log('🎵 Playing track:', trackUri);

      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.state.deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          uris: [trackUri]
        })
      });

      console.log('🎵 Play track response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🎵 Play track error response:', errorText);
      }

      return response.ok;
    } catch (error) {
      console.error('❌ Error playing track:', error);
      return false;
    }
  }

  // Play a playlist
  async playPlaylist(playlistUri: string): Promise<boolean> {
    try {
      if (!this.state.deviceId) {
        throw new Error('Player not ready');
      }

      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.state.deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          context_uri: playlistUri
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error playing playlist:', error);
      return false;
    }
  }

  // Toggle play/pause
  async togglePlay(): Promise<boolean> {
    try {
      console.log('🎮 Toggle play clicked - Current state:', {
        isConnected: this.state.isConnected,
        isPlaying: this.state.isPlaying,
        hasPlayer: !!this.player,
        hasDeviceId: !!this.state.deviceId,
        currentTrack: this.state.currentTrack?.name || 'None'
      });

      if (!this.player) {
        console.log('❌ No player instance available');
        return false;
      }

      if (!this.state.isConnected) {
        console.log('❌ Player not connected');
        return false;
      }

      if (this.state.isPlaying) {
        console.log('⏸️ Attempting to pause...');
        await this.player.pause();
        console.log('✅ Pause command sent');
      } else {
        console.log('▶️ Attempting to resume...');
        await this.player.resume();
        console.log('✅ Resume command sent');
      }

      return true;
    } catch (error) {
      console.error('❌ Error toggling play:', error);
      return false;
    }
  }

  // Skip to next track
  async nextTrack(): Promise<boolean> {
    try {
      if (!this.player) return false;
      await this.player.nextTrack();
      return true;
    } catch (error) {
      console.error('Error skipping to next track:', error);
      return false;
    }
  }

  // Skip to previous track
  async previousTrack(): Promise<boolean> {
    try {
      if (!this.player) return false;
      await this.player.previousTrack();
      return true;
    } catch (error) {
      console.error('Error skipping to previous track:', error);
      return false;
    }
  }

  // Set volume
  async setVolume(volume: number): Promise<boolean> {
    try {
      if (!this.player) return false;

      this.state.volume = Math.max(0, Math.min(1, volume));
      await this.player.setVolume(this.state.volume * 100);
      this.notifyStateChange();
      return true;
    } catch (error) {
      console.error('Error setting volume:', error);
      return false;
    }
  }

  // Seek to position
  async seek(positionMs: number): Promise<boolean> {
    try {
      if (!this.player) return false;
      await this.player.seek(positionMs);
      return true;
    } catch (error) {
      console.error('Error seeking:', error);
      return false;
    }
  }

  // Get user's playlists
  async getUserPlaylists(): Promise<SpotifyPlaylist[]> {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch playlists');

      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error('Error fetching playlists:', error);
      return [];
    }
  }

  // Get workout playlists (featured or category)
  async getWorkoutPlaylists(): Promise<SpotifyPlaylist[]> {
    try {
      // Get workout category playlists
      const response = await fetch('https://api.spotify.com/v1/browse/categories/playlists?category_id=0JQ5DAqbMKFHCxg5H5Ptqw&limit=10', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch workout playlists');

      const data = await response.json();
      return data.playlists.items;
    } catch (error) {
      console.error('Error fetching workout playlists:', error);
      return [];
    }
  }

  // Search for tracks
  async searchTracks(query: string): Promise<SpotifyTrack[]> {
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) throw new Error('Failed to search tracks');

      const data = await response.json();
      return data.tracks.items;
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  }

  // Subscribe to state changes
  onStateChange(callback: (state: MusicServiceState) => void) {
    this.stateChangeCallbacks.push(callback);
  }

  // Unsubscribe from state changes
  offStateChange(callback: (state: MusicServiceState) => void) {
    const index = this.stateChangeCallbacks.indexOf(callback);
    if (index > -1) {
      this.stateChangeCallbacks.splice(index, 1);
    }
  }

  // Notify all subscribers of state change
  private notifyStateChange() {
    this.stateChangeCallbacks.forEach(callback => callback({ ...this.state }));
  }

  // Get current state
  getState(): MusicServiceState {
    return { ...this.state };
  }

  // Public method to load user library
  async loadUserLibraryPublic(): Promise<void> {
    return this.loadUserLibrary();
  }

  // Disconnect player
  async disconnect(): Promise<void> {
    try {
      if (this.player) {
        await this.player.disconnect();
        this.player = null;
      }
      this.state = {
        isPlaying: false,
        currentTrack: null,
        currentPlaylist: null,
        volume: 0.75,
        position: 0,
        duration: 0,
        isConnected: false,
        deviceId: null
      };
      this.notifyStateChange();
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }

  // Format milliseconds to MM:SS
  static formatTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Export singleton instance
export const spotifyService = new SpotifyService();
export default spotifyService;