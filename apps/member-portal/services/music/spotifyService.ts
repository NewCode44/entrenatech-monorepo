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
      this.token = token;

      if (!window.Spotify) {
        throw new Error('Spotify SDK not loaded');
      }

      this.player = new window.Spotify.Player({
        name: 'EntrenaTech Fitness',
        getOAuthToken: (cb: (token: string) => void) => {
          cb(token);
        },
        volume: this.state.volume
      });

      // Event listeners
      this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Spotify Player Ready with device ID:', device_id);
        this.state.deviceId = device_id;
        this.state.isConnected = true;
        this.notifyStateChange();
      });

      this.player.addListener('player_state_changed', (state: any) => {
        if (state) {
          this.updatePlayerState(state);
        }
      });

      this.player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID is offline:', device_id);
      });

      this.player.addListener('initialization_error', ({ message }: { message: string }) => {
        console.error('Failed to initialize:', message);
      });

      this.player.addListener('authentication_error', ({ message }: { message: string }) => {
        console.error('Failed to authenticate:', message);
      });

      await this.player.connect();
      return true;

    } catch (error) {
      console.error('Error initializing Spotify player:', error);
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

  // Play a track
  async playTrack(trackUri: string): Promise<boolean> {
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
          uris: [trackUri]
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error playing track:', error);
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
      if (!this.player) return false;

      if (this.state.isPlaying) {
        await this.player.pause();
      } else {
        await this.player.resume();
      }

      return true;
    } catch (error) {
      console.error('Error toggling play:', error);
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