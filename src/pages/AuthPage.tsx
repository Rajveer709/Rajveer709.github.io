import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { CheckSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>Google</title>
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.9 2.04-5.07 2.04-4.35 0-7.88-3.58-7.88-7.98s3.53-7.98 7.88-7.98c2.18 0 3.84.88 4.78 1.82l2.6-2.6C18.5 1.73 15.87 0 12.48 0 5.88 0 0 5.58 0 12s5.88 12 12.48 12c7.2 0 12.03-4.12 12.03-12.24 0-.76-.08-1.47-.2-2.16H12.48z" />
  </svg>
);

export const AuthPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    setLoading(true);
    const { email, password, name } = values;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Check your email for the confirmation link!');
      navigate('/');
    }
    setLoading(false);
  };

  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    setLoading(true);
    const { email, password } = values;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed in successfully!');
      navigate('/');
    }
    setLoading(false);
  };

  const handleSignInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin,
        },
    });
    if (error) {
        toast.error(error.message);
        setLoading(false);
    }
    // On success, Supabase handles the redirect, so no need to set loading to false.
  };

  const handleDeleteAccount = async () => {
    // Use Supabase client to call the new edge function
    const { error } = await supabase.functions.invoke('delete-account');
    if (error) {
      console.error('Error deleting account:', error);
      toast.error(error.message || 'Failed to delete account.');
      return;
    }

    // Remove only your app's keys from localStorage
    Object.keys(localStorage)
      .filter(key => key.startsWith('lifeAdmin'))
      .forEach(key => localStorage.removeItem(key));

    await supabase.auth.signOut();
    toast.success('Account deleted.');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background/80 via-background/60 to-background/90 relative p-4">
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 60% 10%, #a78bfa33 0%, transparent 70%), radial-gradient(circle at 20% 80%, #fbbf2433 0%, transparent 70%)',
        backgroundSize: 'cover',
      }} />
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="bg-white/30 dark:bg-background/30 backdrop-blur-lg p-4 rounded-3xl shadow-2xl mb-4 border border-white/30 dark:border-border/40 flex items-center justify-center" style={{boxShadow:'0 8px 32px 0 rgba(31, 38, 135, 0.15)'}}>
            <CheckSquare className="w-10 h-10 md:w-12 md:h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary drop-shadow-lg tracking-tight">
            Life Admin
          </h1>
          <p className="text-lg md:text-xl font-medium text-foreground/90 mt-2 animate-fade-in px-2 text-center" style={{ animationDelay: '200ms' }}>
            Simplify Life. One Task at a Time.
          </p>
        </div>
        <Tabs defaultValue="signin" className="w-full animate-fade-in" style={{ animationDelay: '300ms' }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card className="bg-white/40 dark:bg-card/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 dark:border-border/50">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold">Welcome Back</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...signInForm}>
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                    <FormField
                      control={signInForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signInForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="bg-white/40 dark:bg-card/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 dark:border-border/50">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold">Create an Account</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="mb-4" onClick={() => navigate('/landing')}>
                  ← Back
                </Button>
                <Form {...signUpForm}>
                  <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                    <FormField
                      control={signUpForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
