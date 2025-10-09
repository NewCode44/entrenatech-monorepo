import { User, LoginCredentials } from '../types/auth';

// Usuarios de ejemplo para demostración
const mockUsers: User[] = [
  {
    id: '1',
    email: 'superadmin@entrenatech.com',
    name: 'Super Administrador',
    role: 'super_admin',
    avatar: 'SA'
  },
  {
    id: '2',
    email: 'owner@powerfit.com',
    name: 'Carlos Rodríguez',
    role: 'gym_owner',
    gymId: 'gym-1',
    gymName: 'PowerFit Gym',
    avatar: 'CR'
  },
  {
    id: '3',
    email: 'trainer@powerfit.com',
    name: 'María López',
    role: 'trainer',
    gymId: 'gym-1',
    gymName: 'PowerFit Gym',
    avatar: 'ML'
  },
  {
    id: '4',
    email: 'member@powerfit.com',
    name: 'Juan Pérez',
    role: 'member',
    gymId: 'gym-1',
    gymName: 'PowerFit Gym',
    avatar: 'JP'
  },
  {
    id: '5',
    email: 'owner@ironhouse.com',
    name: 'Ana Martínez',
    role: 'gym_owner',
    gymId: 'gym-2',
    gymName: 'Iron House Gym',
    avatar: 'AM'
  }
];

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<User | null> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Buscar usuario por email (en producción esto sería una API call)
    const user = mockUsers.find(u => u.email === credentials.email);

    if (user && credentials.password === 'password123') {
      this.currentUser = user;
      localStorage.setItem('entrenatech_user', JSON.stringify(user));
      return user;
    }

    return null;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('entrenatech_user');
  }

  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Revisar localStorage
    const storedUser = localStorage.getItem('entrenatech_user');
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
        return this.currentUser;
      } catch {
        localStorage.removeItem('entrenatech_user');
      }
    }

    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Método para obtener la URL de redirección según el rol
  getRedirectUrl(user: User): string {
    switch (user.role) {
      case 'super_admin':
        return '/admin';
      case 'gym_owner':
      case 'trainer':
        return '/owner';
      case 'member':
        return '/member';
      default:
        return '/login';
    }
  }
}