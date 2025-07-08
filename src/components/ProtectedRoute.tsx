
import { Navigate, Outlet } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  session: Session | null;
}

export const ProtectedRoute = ({ session }: ProtectedRouteProps) => {
  // Allow guests if guest flag is set in localStorage
  const isGuest = typeof window !== 'undefined' && localStorage.getItem('lifeAdminGuest') === 'true';
  if (!session && !isGuest) {
    return <Navigate to="/landing" replace />;
  }
  return <Outlet />;
};
