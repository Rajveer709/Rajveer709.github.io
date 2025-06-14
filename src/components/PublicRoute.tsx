
import { Navigate, Outlet } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';

interface PublicRouteProps {
  session: Session | null;
}

export const PublicRoute = ({ session }: PublicRouteProps) => {
  if (session) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
