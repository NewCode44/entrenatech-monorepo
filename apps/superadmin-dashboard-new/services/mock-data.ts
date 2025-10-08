import { DashboardStats } from './mock-data';

// Define interfaces locally to avoid import issues
interface Gym {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  members: number;
  status: 'active' | 'trial' | 'suspended';
  revenue: number;
  joinDate: string;
  lastActive: string;
  plan: 'basic' | 'premium' | 'enterprise';
}

interface Mikrotik {
  id: string;
  name: string;
  ip: string;
  model: string;
  firmware: string;
  location: string;
  status: 'online' | 'offline' | 'warning';
  uptime: string;
  cpu: number;
  memory: number;
  temperature: number;
  connectedClients: number;
  lastSeen: string;
  gymName: string;
}

export const mockGyms: Gym[] = [
  {
    id: '1',
    name: 'PowerFit Gym',
    owner: 'Carlos Rodríguez',
    email: 'carlos@powerfit.com',
    phone: '+52 555-123-4567',
    members: 245,
    status: 'active',
    revenue: 24500,
    joinDate: '2024-01-15',
    lastActive: '2024-10-06',
    plan: 'premium'
  },
  {
    id: '2',
    name: 'FitZone Center',
    owner: 'María González',
    email: 'maria@fitzone.com',
    phone: '+52 555-987-6543',
    members: 189,
    status: 'active',
    revenue: 18900,
    joinDate: '2024-02-20',
    lastActive: '2024-10-07',
    plan: 'basic'
  },
  {
    id: '3',
    name: 'Elite Fitness',
    owner: 'Roberto Martínez',
    email: 'roberto@elitefitness.com',
    phone: '+52 555-456-7890',
    members: 412,
    status: 'trial',
    revenue: 0,
    joinDate: '2024-09-01',
    lastActive: '2024-10-05',
    plan: 'premium'
  }
];

export const mockMikrotiks: Mikrotik[] = [
  {
    id: '1',
    name: 'MT-Router-01',
    ip: '192.168.1.1',
    model: 'RB4011iGS+',
    firmware: '7.12',
    location: 'PowerFit Gym - Sala Principal',
    status: 'online',
    uptime: '45 días',
    cpu: 15,
    memory: 32,
    temperature: 42,
    connectedClients: 45,
    lastSeen: '2024-10-07 15:30:00',
    gymName: 'PowerFit Gym'
  },
  {
    id: '2',
    name: 'MT-Router-02',
    ip: '192.168.1.2',
    model: 'RB750Gr3',
    firmware: '7.11',
    location: 'FitZone Center - Recepción',
    status: 'offline',
    uptime: '0 días',
    cpu: 0,
    memory: 0,
    temperature: 0,
    connectedClients: 0,
    lastSeen: '2024-10-07 14:15:00',
    gymName: 'FitZone Center'
  },
  {
    id: '3',
    name: 'MT-Router-03',
    ip: '192.168.1.3',
    model: 'RB2011UiAS',
    firmware: '7.12',
    location: 'Elite Fitness - Área de Pesas',
    status: 'warning',
    uptime: '12 días',
    cpu: 85,
    memory: 78,
    temperature: 68,
    connectedClients: 32,
    lastSeen: '2024-10-07 15:25:00',
    gymName: 'Elite Fitness'
  }
];

export interface DashboardStats {
  totalGyms: number;
  activeGyms: number;
  totalMembers: number;
  totalRevenue: number;
  onlineMikrotiks: number;
  totalMikrotiks: number;
  systemHealth: 'good' | 'warning' | 'critical';
  newSignups: number;
  newGymsThisMonth: number;
}

export const mockDashboardStats: DashboardStats = {
  totalGyms: 127,
  activeGyms: 98,
  totalMembers: 45832,
  totalRevenue: 892450,
  onlineMikrotiks: 245,
  totalMikrotiks: 267,
  systemHealth: 'good',
  newSignups: 234,
  newGymsThisMonth: 8
};