const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class ApiService {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadAccessToken();
  }

  // Token management
  private loadAccessToken() {
    this.accessToken = localStorage.getItem('accessToken');
  }

  private saveAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  private removeAccessToken() {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle 401 unauthorized
        if (response.status === 401) {
          this.removeAccessToken();
          window.location.href = '/login';
        }
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.tokens?.accessToken) {
      this.saveAccessToken(response.data.tokens.accessToken);
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.removeAccessToken();
    }
  }

  // SuperAdmin Dashboard methods
  async getDashboardStats() {
    return this.request('/superadmin/dashboard/stats');
  }

  async getGyms(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    plan?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    return this.request<PaginatedResponse<any>>(`/superadmin/gyms?${queryParams}`);
  }

  async createGym(gymData: any) {
    return this.request('/superadmin/gyms', {
      method: 'POST',
      body: JSON.stringify(gymData),
    });
  }

  async updateGym(id: string, updates: any) {
    return this.request(`/superadmin/gyms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteGym(id: string) {
    return this.request(`/superadmin/gyms/${id}`, {
      method: 'DELETE',
    });
  }

  async getMikrotiks(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    gymId?: string;
  } = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    return this.request<PaginatedResponse<any>>(`/superadmin/mikrotiks?${queryParams}`);
  }

  async updateMikrotikStatus(id: string, status: {
    status: string;
    cpuUsage?: number;
    memoryUsage?: number;
    temperature?: number;
    connectedClients?: number;
  }) {
    return this.request(`/superadmin/mikrotiks/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(status),
    });
  }

  async getSystemHealth() {
    return this.request('/superadmin/system/health');
  }

  async getRecentActivity(limit = 50) {
    return this.request(`/superadmin/activity?limit=${limit}`);
  }

  // User management
  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(updates: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Utility methods
  isAuthenticated() {
    return !!this.accessToken;
  }

  getAccessToken() {
    return this.accessToken;
  }
}

// Create singleton instance
export const apiService = new ApiService(API_BASE_URL);

// Export types
export type { ApiResponse, PaginatedResponse };