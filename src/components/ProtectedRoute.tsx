
import { Navigate, Outlet } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  session: Session | null;
}

export const ProtectedRoute = ({ session }: ProtectedRouteProps) => {
  if (!session) {
    return <Navigate to="/landing" replace />;
  }

  return <Outlet />;
};
