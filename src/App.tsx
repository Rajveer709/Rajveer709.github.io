
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { Session } from "@supabase/supabase-js";
import Index from "./pages/Index";
import { AuthPage } from "./pages/AuthPage";
import { LandingPage } from "./components/LandingPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";

const supabase = createClient(
  "https://gkuoobdtyqygbxbzmpgm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrdW9vYmR0eXF5Z2J4YnptcGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3NTE5MTUsImV4cCI6MjA1MDMyNzkxNX0.ZCKdNBWjBJu1p2HdiBgHHqo9lqriBrmOjfpTqRLpLMk"
);

const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    // This will be handled by the routing
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <PublicRoute session={session}>
                <LandingPage onGetStarted={handleGetStarted} currentTheme="purple" />
              </PublicRoute>
            } 
          />
          <Route 
            path="/auth" 
            element={
              <PublicRoute session={session}>
                <AuthPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/app/*" 
            element={
              <ProtectedRoute session={session}>
                <Index />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
