
import { Navigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';

interface PublicRouteProps {
  session: Session | null;
  children: React.ReactNode;
}

export const PublicRoute = ({ session, children }: PublicRouteProps) => {
  if (session) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};
