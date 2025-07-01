
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { supabase } from './integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import Index from './pages/Index';
import { AuthPage } from './pages/AuthPage';
import { LandingPage } from './components/LandingPage';
import NotFound from './pages/NotFound';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Router>
          <Routes>
            <Route path="/landing" element={<PublicRoute session={session}><LandingPage /></PublicRoute>} />
            <Route path="/auth" element={<PublicRoute session={session}><AuthPage /></PublicRoute>} />
            <Route path="/app/*" element={<ProtectedRoute session={session}><Index /></ProtectedRoute>} />
            <Route path="/" element={session ? <Navigate to="/app" replace /> : <Navigate to="/landing" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
