import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layout';

import { DashboardPage } from '../pages/dashboard/dashboard-page';
import { GymsListPage } from '../pages/gyms/gyms-list-page';
import { GymDetailPage } from '../pages/gyms/gym-detail-page';
import { MikrotiksListPage } from '../pages/mikrotiks/mikrotiks-list-page';
import { MikrotikDetailPage } from '../pages/mikrotiks/mikrotik-detail-page';
import { AnalyticsPage } from '../pages/analytics/analytics-page';
import { SettingsPage } from '../pages/settings/settings-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/gyms', element: <GymsListPage /> },
      { path: '/gyms/:gymId', element: <GymDetailPage /> },
      { path: '/mikrotiks', element: <MikrotiksListPage /> },
      { path: '/mikrotiks/:mikrotikId', element: <MikrotikDetailPage /> },
      { path: '/analytics', element: <AnalyticsPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
]);