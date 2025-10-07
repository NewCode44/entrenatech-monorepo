export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'gym_owner' | 'trainer' | 'member';
  gymId?: string;
  gymName?: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}