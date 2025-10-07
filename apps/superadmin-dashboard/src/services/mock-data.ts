import { Gym, Mikrotik, DashboardStats } from '@/types';

export const mockGyms: Gym[] = [
  {
    id: '1',
    name: 'Iron Temple Gym',
    owner: 'Carlos Ruiz',
    email: 'carlos@irontemple.com',
    status: 'active',
    membersCount: 245,
    monthlyRevenue: 4890,
    mikrotikIp: '192.168.1.1',
    createdAt: '2023-10-15',
    lastLogin: '2024-01-28T10:30:00Z',
    subscriptionTier: 'premium'
  },
  {
    id: '2',
    name: 'PowerFit Center',
    owner: 'María González',
    email: 'maria@powerfit.com',
    status: 'active',
    membersCount: 189,
    monthlyRevenue: 3750,
    mikrotikIp: '192.168.2.1',
    createdAt: '2023-11-22',
    lastLogin: '2024-01-27T15:45:00Z',
    subscriptionTier: 'premium'
  },
  {
    id: '3',
    name: 'Elite Fitness Studio',
    owner: 'Roberto Silva',
    email: 'roberto@elitefitness.com',
    status: 'trial',
    membersCount: 67,
    monthlyRevenue: 0,
    mikrotikIp: '192.168.3.1',
    createdAt: '2024-01-10',
    lastLogin: '2024-01-26T09:15:00Z',
    subscriptionTier: 'basic'
  },
  {
    id: '4',
    name: 'GymZone Express',
    owner: 'Ana Martínez',
    email: 'ana@gymzone.com',
    status: 'suspended',
    membersCount: 134,
    monthlyRevenue: 2680,
    mikrotikIp: '192.168.4.1',
    createdAt: '2023-08-05',
    lastLogin: '2024-01-20T14:20:00Z',
    subscriptionTier: 'basic'
  },
  {
    id: '5',
    name: 'CrossFit Champions',
    owner: 'Diego Torres',
    email: 'diego@crossfitchamp.com',
    status: 'active',
    membersCount: 312,
    monthlyRevenue: 6240,
    mikrotikIp: '192.168.5.1',
    createdAt: '2023-06-18',
    lastLogin: '2024-01-28T16:10:00Z',
    subscriptionTier: 'enterprise'
  }
];

export const mockMikrotiks: Mikrotik[] = [
  {
    id: 'mk-1',
    name: 'Router Iron Temple',
    ipAddress: '190.104.15.22',
    status: 'online',
    version: 'RouterOS 7.12',
    gymId: '1',
    uptime: '15d 4h 32m',
    cpuLoad: 25,
    memoryUsage: 42,
    connectedDevices: 48
  },
  {
    id: 'mk-2',
    name: 'Router PowerFit',
    ipAddress: '190.104.23.45',
    status: 'online',
    version: 'RouterOS 7.11',
    gymId: '2',
    uptime: '8d 12h 15m',
    cpuLoad: 18,
    memoryUsage: 35,
    connectedDevices: 36
  },
  {
    id: 'mk-3',
    name: 'Router Elite Fitness',
    ipAddress: '190.104.28.67',
    status: 'offline',
    version: 'RouterOS 7.10',
    gymId: '3',
    uptime: '0d 0h 0m',
    cpuLoad: 0,
    memoryUsage: 0,
    connectedDevices: 0
  },
  {
    id: 'mk-4',
    name: 'Router GymZone',
    ipAddress: '190.104.31.89',
    status: 'online',
    version: 'RouterOS 7.9',
    gymId: '4',
    uptime: '23d 7h 48m',
    cpuLoad: 32,
    memoryUsage: 58,
    connectedDevices: 27
  },
  {
    id: 'mk-5',
    name: 'Router CrossFit Champions',
    ipAddress: '190.104.35.102',
    status: 'online',
    version: 'RouterOS 7.12',
    gymId: '5',
    uptime: '45d 2h 15m',
    cpuLoad: 45,
    memoryUsage: 67,
    connectedDevices: 62
  }
];

export const mockDashboardStats: DashboardStats = {
  totalGyms: mockGyms.length,
  activeGyms: mockGyms.filter(g => g.status === 'active').length,
  totalMembers: mockGyms.reduce((sum, gym) => sum + gym.membersCount, 0),
  totalRevenue: mockGyms.reduce((sum, gym) => sum + gym.monthlyRevenue, 0),
  mikrotiksOnline: mockMikrotiks.filter(m => m.status === 'online').length,
  mikrotiksOffline: mockMikrotiks.filter(m => m.status === 'offline').length,
  newGymsThisMonth: 2,
  revenueGrowth: 12.5
};