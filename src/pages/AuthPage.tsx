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
import { themes, defaultTheme } from '@/config/themes';

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
  const theme = themes.find(t => t.value === 'purple') || themes.find(t => t.value === defaultTheme);

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
    try {
      const { email, password, name } = values;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/app`,
        },
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Check your email for the confirmation link!');
        // Don't navigate immediately, let the auth state change handle it
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    setLoading(true);
    try {
      const { email, password } = values;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Signed in successfully!');
        // Don't navigate immediately, let the auth state change handle it
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      });
      if (error) {
        toast.error(error.message);
        setLoading(false);
      }
      // Don't set loading to false here for OAuth as it will redirect
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-md mx-auto animate-fade-in opacity-0" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-center mb-8 animate-scale-in opacity-0" style={{ animationDelay: '200ms' }}>
          <div className="bg-card/30 backdrop-blur-sm p-3 md:p-4 rounded-2xl shadow-xl mr-3 md:mr-4 border border-border/20">
            <CheckSquare className="w-8 h-8 md:w-12 md:h-12" style={{ color: theme?.colors.primary }} />
          </div>
          <h1 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Life Admin
          </h1>
        </div>
        
        <div className="animate-slide-in-from-left opacity-0" style={{ animationDelay: '300ms' }}>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin" className="transition-all duration-300 hover:scale-105">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="transition-all duration-300 hover:scale-105">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <Card className="border-border/30 shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm bg-card/50">
                <CardHeader className="text-center pb-4">
                  <CardTitle 
                    className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
                    }}
                  >
                    Welcome Back
                  </CardTitle>
                  <p className="text-muted-foreground text-base">Sign in to your account</p>
                </CardHeader>
                <CardContent>
                  <Form {...signInForm}>
                    <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                      <FormField
                        control={signInForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="you@example.com" 
                                {...field} 
                                className="transition-all duration-300 focus:scale-105 border-border/50 focus:border-primary/50"
                              />
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
                            <FormLabel className="text-foreground font-medium">Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                                className="transition-all duration-300 focus:scale-105 border-border/50 focus:border-primary/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl" 
                        disabled={loading}
                      >
                        {loading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </form>
                  </Form>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/30" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 text-muted-foreground font-medium">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full transition-all duration-300 hover:scale-105 border-border/50 hover:border-primary/30" 
                    onClick={handleSignInWithGoogle} 
                    disabled={loading}
                  >
                    <GoogleIcon className="mr-2 h-4 w-4" />
                    Sign In with Google
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
              <Card className="border-border/30 shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm bg-card/50">
                <CardHeader className="text-center pb-4">
                  <CardTitle 
                    className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
                    }}
                  >
                    Create Account
                  </CardTitle>
                  <p className="text-muted-foreground text-base">Get started with Life Admin</p>
                </CardHeader>
                <CardContent>
                  <Form {...signUpForm}>
                    <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                      <FormField
                        control={signUpForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your Name" 
                                {...field} 
                                className="transition-all duration-300 focus:scale-105 border-border/50 focus:border-primary/50"
                              />
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
                            <FormLabel className="text-foreground font-medium">Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="you@example.com" 
                                {...field} 
                                className="transition-all duration-300 focus:scale-105 border-border/50 focus:border-primary/50"
                              />
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
                            <FormLabel className="text-foreground font-medium">Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                                className="transition-all duration-300 focus:scale-105 border-border/50 focus:border-primary/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl" 
                        disabled={loading}
                      >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                      </Button>
                    </form>
                  </Form>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/30" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 text-muted-foreground font-medium">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full transition-all duration-300 hover:scale-105 border-border/50 hover:border-primary/30" 
                    onClick={handleSignInWithGoogle} 
                    disabled={loading}
                  >
                    <GoogleIcon className="mr-2 h-4 w-4" />
                    Sign Up with Google
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
