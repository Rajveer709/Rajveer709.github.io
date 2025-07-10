import { Moon, Sun, User, Palette, Info, RotateCcw, Lock, LogOut, EyeOff, Eye, Check, Medal } from 'lucide-react';
import { Button as RawButton } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { themes } from '../config/themes';
import { getRankForLevel, RANKS } from '../config/ranks';
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
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';
import { Task, Profile } from './Index';
import { HackDialog } from '../components/HackDialog';
import { useOutletContext } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Button: any = RawButton;

interface SettingsPageProps {
  onBack: () => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onStartOver: () => void;
  userLevel: number;
  user: SupabaseUser | null;
  onSignOut: () => void;
  backgroundLightness: number;
  onBackgroundLightnessChange: (value: number) => void;
  cardLightness: number;
  onCardLightnessChange: (value: number) => void;
  tasks: Task[];
  onRestoreTask: (taskId: string) => void;
  onUnlockAll: () => void;
}

interface OutletContextType {
  profile: Profile | null;
  onUpdateProfile: (updatedProfile: Partial<Profile>, avatarFile?: File) => Promise<void>;
  showGreeting: boolean;
}

export const SettingsPage = ({ onBack, currentTheme, onThemeChange, isDarkMode, onToggleDarkMode, onStartOver, userLevel, user, onSignOut, backgroundLightness, onBackgroundLightnessChange, cardLightness, onCardLightnessChange, tasks, onRestoreTask, onUnlockAll }: SettingsPageProps) => {
  const { profile, onUpdateProfile, showGreeting } = useOutletContext<OutletContextType>();
  const [name, setName] = useState(profile?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const hiddenTasks = tasks.filter(task => task.hidden);
  // Allow rank switching if unlockAllCheats is set
  const unlockAllCheats = typeof window !== 'undefined' && window.localStorage.getItem('unlockAllCheats') === 'true';
  const [selectedRank, setSelectedRank] = useState<number | null>(null);
  const rank = unlockAllCheats && selectedRank !== null ? RANKS[selectedRank] : getRankForLevel(userLevel);
  const isAvi = rank.name === 'Avi';
  // Handler for switching ranks (only if unlockAllCheats)
  const handleRankSwitch = (idx: number) => {
    setSelectedRank(idx);
    // Optionally, you could also update userLevel or other state if needed
  };
        {/* Rank Switcher (only if unlockAllCheats) */}
        {unlockAllCheats && (
          <Card className="animate-scale-in bg-card/80 dark:bg-card/30 backdrop-blur-sm border-0 shadow-lg" style={{ animationDelay: '250ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Medal className="w-4 h-4" />
                <span>Switch Rank</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {RANKS.map((r, idx) => (
                <Button
                  key={r.name}
                  variant={rank.name === r.name ? 'default' : 'outline'}
                  className="flex items-center gap-1 px-3 py-1 text-xs"
                  onClick={() => handleRankSwitch(idx)}
                >
                  <r.Icon className="w-4 h-4" /> {r.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
  const [quickAddPopupEnabled, setQuickAddPopupEnabled] = useState(() => {
    const stored = localStorage.getItem('quickAddPopupEnabled');
    return stored === null ? true : stored === 'true';
  });
  const [desktopView, setDesktopView] = useState(() => {
    const stored = localStorage.getItem('desktopView');
    return stored === null ? false : stored === 'true';
  });
  const [isMobile, setIsMobile] = useState(false);

  // Calculate how many themes should be unlocked based on level (3 per rank) + gold for Avi
  // If any cheat code has been entered, unlock Royal Pink and allow toggling
  const cheatUnlockType = typeof window !== 'undefined' ? window.localStorage.getItem('cheatUnlockType') : null;
  const hasRoyalPinkUnlocked = cheatUnlockType !== null || unlockAllCheats;
  const getUnlockedThemeCount = (level: number) => {
    if (level >= 100) return themes.length; // Avi gets all themes including gold
    if (hasRoyalPinkUnlocked) return themes.length - 1; // All except gold
    return Math.min(level * 3, 12); // 3 themes per level, max 12 for the regular ranks
  };
  
  useEffect(() => {
    if (!isEditing) {
      setName(profile?.name || '');
    }
  }, [profile, isEditing]);

  useEffect(() => {
    localStorage.setItem('quickAddPopupEnabled', String(quickAddPopupEnabled));
  }, [quickAddPopupEnabled]);

  useEffect(() => {
    localStorage.setItem('desktopView', String(desktopView));
  }, [desktopView]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getInitials = (name: string | null | undefined) => {
    if (!name || name.trim() === '') return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSaveProfile = () => {
    if (onUpdateProfile) {
      const updates: Partial<Profile> = {};
      if (name !== profile?.name) updates.name = name;
      onUpdateProfile(updates);
    }
    setIsEditing(false);
  }

  // Delete account handler
  const handleDeleteAccount = async () => {
    if (!user) return;
    // Delete profile from DB
    await import('@/integrations/supabase/client').then(async ({ supabase }) => {
      await supabase.from('profiles').delete().eq('id', user.id);
      // TODO: Delete all user data from other tables if needed
      // Remove all user-related localStorage
      const keys = [
        `lifeAdminTasks_${user.id}`,
        `lifeAdminTheme_${user.id}`,
        `lifeAdminDarkMode_${user.id}`,
        `lifeAdminUserLevel_${user.id}`,
        `lifeAdminUserXp_${user.id}`,
        `lifeAdminChallenges_${user.id}`,
        `lifeAdminBgLightness_${user.id}`,
        `lifeAdminCardLightness_${user.id}`,
        `lifeAdminStartedChallenges_${user.id}`,
      ];
      keys.forEach(k => localStorage.removeItem(k));
      // Placeholder: Deleting user from Supabase Auth requires admin API or edge function
      // await supabase.auth.admin.deleteUser(user.id); // Not available on client
      await supabase.auth.signOut();
      setShowDeleteDialog(false);
      navigate('/auth');
    });
  };

  return (
    <TooltipProvider>
      <div className="animate-fade-in space-y-4 pb-8">
        <PageHeader
          title="Settings"
          onBack={onBack}
          profile={profile}
          onUpdateProfile={onUpdateProfile}
          showAvatar={true}
        />

        {/* Account Card - Compact */}
        <Card className="animate-scale-in bg-card/80 dark:bg-card/30 backdrop-blur-sm border-0 shadow-lg" style={{ animationDelay: '100ms' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4" />
              <span>Account</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-10 h-10 border">
                  <AvatarImage src={profile?.avatar_url || ''} alt={profile?.name || 'User'} />
                  <AvatarFallback className="text-lg">{getInitials(profile?.name)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-card p-1 rounded-full shadow-md border">
                  <rank.Icon className="w-3 h-3 text-primary" />
                </div>
              </div>
              <div className="flex-grow space-y-1 min-w-0">
                {isEditing ? (
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="h-8" />
                ) : (
                  <p className="font-semibold text-sm truncate">{profile?.name || 'No name set'}</p>
                )}
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button onClick={() => { 
                    setIsEditing(false); 
                    setName(profile?.name || '');
                  }} variant="ghost" size="sm" className="h-8 px-3" asChild={false}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} size="sm" className="h-8 px-3">Save</Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="h-8 px-3">Edit</Button>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t px-4 py-3 flex justify-end gap-2">
            <Button variant="ghost" onClick={onSignOut} size="sm" className="h-8">
              <LogOut className="w-3 h-3 mr-2" />
              Sign Out
            </Button>
          </CardFooter>
        </Card>

        {/* Delete Account Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your account and all associated data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-white">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Appearance Card - Compact */}
        <Card className="animate-scale-in bg-card/80 dark:bg-card/30 backdrop-blur-sm border-0 shadow-lg" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="w-4 h-4" />
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="dark-mode-switch" className="flex items-center gap-2 cursor-pointer text-sm">
                {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span>Dark Mode</span>
              </label>
              <Switch id="dark-mode-switch" checked={isDarkMode} onCheckedChange={onToggleDarkMode} />
            </div>

            {/* Quick Add Pop-up Toggle */}
            <div className="flex items-center justify-between">
              <label htmlFor="quick-add-popup-switch" className="flex items-center gap-2 cursor-pointer text-sm">
                <span>Quick Add Pop-up in Add Task Page</span>
              </label>
              <Switch id="quick-add-popup-switch" checked={quickAddPopupEnabled} onCheckedChange={setQuickAddPopupEnabled} />
            </div>

            {/* Desktop View Toggle */}
            <div className="flex items-center justify-between">
              <label htmlFor="desktop-view-switch" className="flex items-center gap-2 cursor-pointer text-sm">
                <span>Desktop View (Optimize for Desktop)</span>
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Switch id="desktop-view-switch" checked={desktopView} onCheckedChange={setDesktopView} disabled={isMobile} />
                    </span>
                  </TooltipTrigger>
                  {isMobile && (
                    <TooltipContent>
                      <span>Desktop View is only available on larger screens.</span>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-2">
              <label htmlFor="bg-lightness-slider" className="text-xs font-medium">Page Background</label>
              <Slider
                id="bg-lightness-slider"
                min={isDarkMode ? 5 : 80}
                max={isDarkMode ? 25 : 100}
                step={1}
                value={[backgroundLightness]}
                onValueChange={(value) => onBackgroundLightnessChange(value[0])}
                className="mt-2"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="card-lightness-slider" className="text-xs font-medium">Card Background</label>
              <Slider
                id="card-lightness-slider"
                min={isDarkMode ? 8 : 80}
                max={isDarkMode ? 30 : 100}
                step={1}
                value={[cardLightness]}
                onValueChange={(value) => onCardLightnessChange(value[0])}
                className="mt-2"
              />
            </div>

            <div>
              <h3
                className="text-sm font-medium mb-1"
                style={isAvi ? { background: 'transparent' } : {}}
              >
                Color Theme
              </h3>
              <p
                className="text-xs text-muted-foreground mb-3"
                style={isAvi ? { background: 'transparent' } : {}}
              >
                {isAvi ? 'All themes unlocked!' : 'Unlock with Challenges - 3 themes per rank.'}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {themes.map((theme, index) => {
                  const unlockedCount = getUnlockedThemeCount(userLevel);
                  // Royal Pink is always unlocked if any cheat code entered
                  const isRoyalPink = theme.value === 'royal-pink';
                  const isUnlocked = isAvi || index < unlockedCount || (isRoyalPink && hasRoyalPinkUnlocked);
                  return (
                    isUnlocked ? (
                      <button
                        key={theme.value}
                        onClick={() => onThemeChange(theme.value)}
                        className={`p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                          currentTheme === theme.value 
                            ? 'border-primary shadow-md' 
                            : 'border-border hover:border-accent'
                        }`}
                      >
                        <div
                          className="w-full h-6 rounded mb-1"
                          style={{ background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})` }}
                        ></div>
                        <span className="text-xs font-medium">{theme.name}</span>
                        {currentTheme === theme.value && (
                          <Check className="w-3 h-3 mx-auto mt-1 text-primary" />
                        )}
                      </button>
                    ) : (
                      <Tooltip key={theme.value}>
                        <TooltipTrigger asChild>
                          <div className="p-2 rounded-lg border-2 border-dashed border-border relative overflow-hidden opacity-60">
                            <div className="w-full h-6 rounded mb-1 bg-muted"></div>
                            <span className="text-xs font-medium text-muted-foreground">{theme.name}</span>
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                              <Lock className="w-3 h-3 text-muted-foreground" />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Unlock by reaching higher ranks</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hidden Tasks Card - FIXED: Better text overflow handling */}
        {hiddenTasks.length > 0 && (
          <Card className="animate-scale-in bg-card/80 dark:bg-card/30 backdrop-blur-sm border-0 shadow-lg" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <EyeOff className="w-4 h-4" />
                <span>Hidden Tasks ({hiddenTasks.length})</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Restore tasks that you've hidden from your main list.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {hiddenTasks.map((task) => (
                  <div key={task.id} className="border border-border/50 rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground break-words line-clamp-2 leading-tight">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-1 break-words line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRestoreTask(task.id)}
                        className="h-7 px-2 text-xs shrink-0"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Restore
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                      <span className="capitalize">{task.priority} priority</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* About Card - Compact */}
        <Card className="animate-scale-in bg-card/80 dark:bg-card/30 backdrop-blur-sm border-0 shadow-lg" style={{ animationDelay: '400ms' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="w-4 h-4" />
              <span>About</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">App Version</span>
              <span className="text-sm text-muted-foreground">1.0.0</span>
            </div>
            <div className="mt-2">
              <a
                href="https://docs.google.com/document/d/e/2PACX-1vRRTPcRObxNvQi2hLf39K6xWjoh1Vvr0URXTlNIiW5801m1st9KOxw8BNlroX94lEyWIriniB_HxNQw/pub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline text-primary hover:text-primary/80 transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Start Over Button - Compact */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full animate-scale-in h-10" style={{ animationDelay: '500ms' }}>
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

        {/* Show All Cheat Codes Button removed as requested */}
      </div>
    </TooltipProvider>
  );
};