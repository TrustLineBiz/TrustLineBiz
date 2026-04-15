import { createBrowserRouter, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import AppShell from '../components/layout/AppShell';
import Login from '../pages/Login';
import Pipeline from '../pages/Pipeline';
import LeadDetail from '../pages/LeadDetail';
import Tasks from '../pages/Tasks';
import Analytics from '../pages/Analytics';
import Settings from '../pages/Settings';

function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <AppShell />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/pipeline" replace /> },
      { path: 'pipeline', element: <Pipeline /> },
      { path: 'leads/:id', element: <LeadDetail /> },
      { path: 'tasks', element: <Tasks /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

export default router;
