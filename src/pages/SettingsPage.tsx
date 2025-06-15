
import { ArrowLeft, Moon, Sun, User, Palette, Info, RotateCcw, Lock, LogOut, EyeOff, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { themes } from '../config/themes';
import { getRankForLevel } from '../config/ranks';
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
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';
import { Task, Profile } from './Index';
import { HackDialog } from '../components/HackDialog';

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
  backgroundLightness: number;
  onBackgroundLightnessChange: (value: number) => void;
  cardLightness: number;
  onCardLightnessChange: (value: number) => void;
  tasks: Task[];
  onRestoreTask: (taskId: string) => void;
  onUnlockAll: () => void;
}

export const SettingsPage = ({ onBack, currentTheme, onThemeChange, isDarkMode, onToggleDarkMode, onStartOver, userLevel, user, profile, onUpdateProfile, onSignOut, backgroundLightness, onBackgroundLightnessChange, cardLightness, onCardLightnessChange, tasks, onRestoreTask, onUnlockAll }: SettingsPageProps) => {
  const [name, setName] = useState(profile?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const hiddenTasks = tasks.filter(task => task.hidden);
  const rank = getRankForLevel(userLevel);
  
  const getInitials = (name: string | null | undefined) => {
    if (!name || name.trim() === '') return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSaveProfile = () => {
    onUpdateProfile({ name });
    setIsEditing(false);
  }

  return (
    <TooltipProvider>
      <div className="animate-fade-in space-y-6 pb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>

        <Card className="animate-scale-in bg-card/80 dark:bg-card/30 backdrop-blur-sm border-0 shadow-lg" style={{ animationDelay: '100ms' }}>
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
              <div className="relative">
                <Avatar className="w-12 h-12 border">
                  <AvatarImage src={profile?.avatar_url || ''} alt={profile?.name || 'User'} />
                  <AvatarFallback className="text-xl">{getInitials(profile?.name)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-card p-1 rounded-full shadow-md border">
                  <rank.Icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="flex-grow space-y-1">
                {isEditing ? (
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
                ) : (
                  <p className="font-semibold">{profile?.name || 'No name set'}</p>
                )}
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button onClick={() => { setIsEditing(false); setName(profile?.name || ''); }} variant="ghost" size="sm">Cancel</Button>
                  <Button onClick={handleSaveProfile} size="sm">Save Changes</Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-end">
            <Button variant="ghost" onClick={onSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardFooter>
        </Card>

        <Card className="animate-scale-in bg-card/80 dark:bg-card/30 backdrop-blur-sm border-0 shadow-lg" style={{ animationDelay: '200ms' }}>
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
              <label htmlFor="bg-lightness-slider" className="text-sm font-medium">Page Background Lightness</label>
              <Slider
                id="bg-lightness-slider"
                min={isDarkMode ? 5 : 80}
                max={isDarkMode ? 25 : 100}
                step={1}
                value={[backgroundLightness]}
                onValueChange={(value) => onBackgroundLightnessChange(value[0])}
                className="mt-3"
              />
            </div>
            
            <div>
              <label htmlFor="card-lightness-slider" className="text-sm font-medium">Card Background Lightness</label>
              <Slider
                id="card-lightness-slider"
                min={isDarkMode ? 8 : 80}
                max={isDarkMode ? 30 : 100}
                step={1}
                value={[cardLightness]}
                onValueChange={(value) => onCardLightnessChange(value[0])}
                className="mt-3"
              />
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

        {hiddenTasks.length > 0 && (
          <Card className="animate-scale-in bg-card/80 dark:bg-card/30 backdrop-blur-sm border-0 shadow-lg" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <EyeOff className="w-5 h-5" />
                <span>Hidden Tasks</span>
              </CardTitle>
              <CardDescription>
                Restore tasks that you've hidden from your main list.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {hiddenTasks.map((task) => (
                  <AccordionItem value={task.id} key={task.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <span className="truncate">{task.title}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Due: {format(new Date(task.dueDate), 'P')}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRestoreTask(task.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Restore Task
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}

        <Card className="animate-scale-in bg-card/80 dark:bg-card/30 backdrop-blur-sm border-0 shadow-lg" style={{ animationDelay: '300ms' }}>
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
            <Button variant="destructive" className="w-full animate-scale-in" style={{ animationDelay: '400ms' }}>
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

        <div className="pt-2 text-center">
          <HackDialog onUnlock={onUnlockAll} />
        </div>
      </div>
    </TooltipProvider>
  );
};
