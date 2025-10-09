// API Service for Member Portal Backend Integration

const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private token: string | null = null;

  // Token management
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });
    this.clearToken();
    return response;
  }

  // AI Nutrition endpoints
  async generateNutritionPlan(profile: {
    goals: string[];
    dietaryRestrictions: string[];
    allergies: string[];
    weight: number;
    height: number;
    age: number;
    gender: 'male' | 'female' | 'other';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    targetCalories?: number;
  }) {
    return this.request('/ai/nutrition/generate', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  // AI Workout endpoints
  async generateWorkoutPlan(profile: {
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
    goals: string[];
    availableDays: string[];
    sessionDuration: number;
    equipment: string[];
    injuries?: string[];
    preferences?: string[];
  }) {
    return this.request('/ai/workout/generate', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  // Exercise analysis endpoints
  async analyzeExerciseForm(description: string) {
    return this.request('/ai/exercise/analyze', {
      method: 'POST',
      body: JSON.stringify({ description }),
    });
  }

  // Generate workout variations
  async generateWorkoutVariations(exerciseName: string, equipment: string[]) {
    return this.request('/ai/exercise/variations', {
      method: 'POST',
      body: JSON.stringify({ exerciseName, equipment }),
    });
  }

  // AI Chat endpoint
  async chatWithAI(message: string) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Member profile endpoints
  async getProfile() {
    return this.request('/member/profile');
  }

  async updateProfile(profileData: any) {
    return this.request('/member/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Workout sessions
  async getWorkoutSessions() {
    return this.request('/member/workouts/sessions');
  }

  async logWorkoutSession(sessionData: any) {
    return this.request('/member/workouts/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  // Progress tracking
  async getProgress() {
    return this.request('/member/progress');
  }

  async updateProgress(progressData: any) {
    return this.request('/member/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  }

  // Nutrition tracking
  async getNutritionLogs() {
    return this.request('/member/nutrition/logs');
  }

  async logNutrition(nutritionData: any) {
    return this.request('/member/nutrition/logs', {
      method: 'POST',
      body: JSON.stringify(nutritionData),
    });
  }

  // Notifications
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;