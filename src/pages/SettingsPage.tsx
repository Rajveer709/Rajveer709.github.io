import { ArrowLeft, Moon, Sun, User, Palette, Info, RotateCcw, Lock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { themes } from '../config/themes';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
}

interface SettingsPageProps {
  onBack: () => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onStartOver: () => void;
  userLevel: number;
  user: SupabaseUser | null;
  profile: Profile | null;
  onUpdateProfile: (updatedProfile: Partial<Profile>) => void;
  onSignOut: () => void;
}

export const SettingsPage = ({ onBack, currentTheme, onThemeChange, isDarkMode, onToggleDarkMode, onStartOver, userLevel, user, profile, onUpdateProfile, onSignOut }: SettingsPageProps) => {
  const [name, setName] = useState(profile?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSaveProfile = () => {
    onUpdateProfile({ name });
    setIsEditing(false);
  }

  return (
    <TooltipProvider>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-5 h-5" />
              <span>Account</span>
            </CardTitle>
            <CardDescription>
              Manage your account settings and profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/8.x/bottts/svg?seed=${user?.email}`} alt={profile?.name || 'User'} />
                <AvatarFallback>{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                {isEditing ? (
                  <div className="flex gap-2 items-center">
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
                    <Button onClick={handleSaveProfile} size="sm">Save</Button>
                    <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm">Cancel</Button>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold">{profile?.name || 'No name set'}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </>
                )}
              </div>
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-end">
            <Button variant="ghost" onClick={onSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="w-5 h-5" />
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <label htmlFor="dark-mode-switch" className="flex items-center gap-2 cursor-pointer">
                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span>Dark Mode</span>
              </label>
              <Switch id="dark-mode-switch" checked={isDarkMode} onCheckedChange={onToggleDarkMode} />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Color Theme</h3>
              <p className="text-xs text-muted-foreground mb-3">Unlocks with Challenges.</p>
              <div className="grid grid-cols-3 gap-3">
                {themes.map((theme) => {
                  const isUnlocked = userLevel >= theme.levelToUnlock;
                  return (
                    isUnlocked ? (
                      <button
                        key={theme.value}
                        onClick={() => onThemeChange(theme.value)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          currentTheme === theme.value 
                            ? 'border-primary shadow-md' 
                            : 'border-border hover:border-accent'
                        }`}
                      >
                        <div
                          className="w-full h-8 rounded mb-2"
                          style={{ background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})` }}
                        ></div>
                        <span className="text-sm font-medium">{theme.name}</span>
                      </button>
                    ) : (
                      <Tooltip key={theme.value}>
                        <TooltipTrigger asChild>
                          <div
                            className="p-3 rounded-lg border-2 border-dashed border-border relative overflow-hidden"
                          >
                            <div
                              className="w-full h-8 rounded mb-2 bg-muted"
                            ></div>
                            <span className="text-sm font-medium text-muted-foreground">{theme.name}</span>
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                              <Lock className="w-5 h-5 text-muted-foreground" />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Unlock at level {theme.levelToUnlock}</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="w-5 h-5" />
              <span>About</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">App Version</span>
              <span className="text-sm text-muted-foreground">1.0.0</span>
            </div>
          </CardContent>
        </Card>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your tasks, challenges, and settings, and return you to the landing page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onStartOver}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};
