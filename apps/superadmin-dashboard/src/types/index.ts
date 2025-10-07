export interface Gym {
  id: string;
  name: string;
  owner: string;
  email: string;
  status: 'active' | 'suspended' | 'trial';
  membersCount: number;
  monthlyRevenue: number;
  mikrotikIp: string;
  createdAt: string;
  lastLogin?: string;
  subscriptionTier: 'basic' | 'premium' | 'enterprise';
}

export interface Mikrotik {
  id: string;
  name: string;
  ipAddress: string;
  status: 'online' | 'offline';
  version: string;
  gymId: string;
  uptime: string;
  cpuLoad: number;
  memoryUsage: number;
  connectedDevices: number;
}

export interface DashboardStats {
  totalGyms: number;
  activeGyms: number;
  totalMembers: number;
  totalRevenue: number;
  mikrotiksOnline: number;
  mikrotiksOffline: number;
  newGymsThisMonth: number;
  revenueGrowth: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}