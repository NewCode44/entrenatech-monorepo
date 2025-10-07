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
    path: '/admin/',
    element: <AppLayout />,
    children: [
      { path: '/admin/', element: <DashboardPage /> },
      { path: '/admin/dashboard', element: <DashboardPage /> },
      { path: '/admin/gyms', element: <GymsListPage /> },
      { path: '/admin/gyms/:gymId', element: <GymDetailPage /> },
      { path: '/admin/mikrotiks', element: <MikrotiksListPage /> },
      { path: '/admin/mikrotiks/:mikrotikId', element: <MikrotikDetailPage /> },
      { path: '/admin/analytics', element: <AnalyticsPage /> },
      { path: '/admin/settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  },
]);