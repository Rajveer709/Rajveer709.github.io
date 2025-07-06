import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { toast } from "sonner";
import { DashboardPage } from './DashboardPage';
import { AddTaskPage } from './AddTaskPage';
import { CalendarPage } from './CalendarPage';
import { SettingsPage } from './SettingsPage';
import { LandingPage } from '../components/LandingPage';
import { themes, defaultTheme } from '../config/themes';
import { ALL_CHALLENGES_DEFINITIONS } from '../config/challenges';
import { hexToHsl } from '../lib/colorUtils';
import { TasksViewPage } from './TasksViewPage';
import { AuthPage } from './AuthPage';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { MainLayout } from '../components/MainLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { PublicRoute } from '../components/PublicRoute';
import { ChallengePage, type Challenge } from './ChallengePage';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
  hidden?: boolean;
}

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}

const XP_FOR_LEVEL = 100;

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [backgroundLightness, setBackgroundLightness] = useState(96);
  const [cardLightness, setCardLightness] = useState(94);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthRoute = location.pathname === '/landing' || location.pathname === '/auth';
  const showGreeting = location.pathname === '/';

  const [userLevel, setUserLevel] = useState(1);
  const [userXp, setUserXp] = useState(0);
  const [challenges, setChallenges] = useState<Challenge[]>(
    ALL_CHALLENGES_DEFINITIONS.map(c => ({...c, completed: false}))
  );
  const [hasStartedChallenges, setHasStartedChallenges] = useState(false);

  const applyTheme = (themeValue: string, isDark: boolean, pageLightness?: number, cardLightnessValue?: number) => {
    const theme = themes.find(t => t.value === themeValue) || themes.find(t => t.value === defaultTheme);
    if (!theme) return;

    const root = document.documentElement;
    const primaryHsl = hexToHsl(theme.colors.primary);

    if (primaryHsl) {
        root.style.setProperty('--primary', `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
        root.style.setProperty('--ring', `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
        
        const bgLightness = pageLightness !== undefined ? pageLightness : (isDark ? 15 : 96);
        const cardLightness = cardLightnessValue !== undefined ? cardLightnessValue : (isDark ? 18 : 94);

        if (isDark) {
          root.style.setProperty('--background', `${primaryHsl.h} ${primaryHsl.s * 0.2}% ${bgLightness}%`);
          root.style.setProperty('--background-gradient-start', `${primaryHsl.h} ${primaryHsl.s * 0.3}% ${bgLightness}%`);
          root.style.setProperty('--background-gradient-end', `${primaryHsl.h} ${primaryHsl.s * 0.3}% ${bgLightness - 5}%`);
          root.style.setProperty('--card', `${primaryHsl.h} ${primaryHsl.s * 0.4}% ${cardLightness}%`);
          root.style.setProperty('--foreground', '210 40% 98%');
          root.style.setProperty('--muted', '217.2 32.6% 17.5%');
          root.style.setProperty('--muted-foreground', '215 20.2% 65.1%');
          root.style.setProperty('--border', '217.2 32.6% 17.5%');
          root.style.setProperty('--input', '217.2 32.6% 17.5%');
        } else {
          root.style.setProperty('--background', `0 0% 100%`);
          root.style.setProperty('--background-gradient-start', `${primaryHsl.h} 50% ${bgLightness}%`);
          root.style.setProperty('--background-gradient-end', `0 0% 100%`);
          root.style.setProperty('--card', `${primaryHsl.h} 60% ${cardLightness}%`);
          root.style.setProperty('--foreground', '222.2 84% 4.9%');
          root.style.setProperty('--muted', '210 40% 96.1%');
          root.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%');
          root.style.setProperty('--border', '214.3 31.8% 91.4%');
          root.style.setProperty('--input', '214.3 31.8% 91.4%');
        }
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = useCallback(async (user: User) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      // If profile doesn't exist, create one with the user's metadata
      if (error.code === 'PGRST116') {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || null,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else if (newProfile) {
          setProfile(newProfile as unknown as Profile);
        }
      }
    } else if (data) {
      setProfile(data as unknown as Profile);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile(user);
    } else {
      setProfile(null);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    if (!user) return; // Don't run this effect if user is not logged in

    const savedTasks = localStorage.getItem(`lifeAdminTasks_${user.id}`);
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
        hidden: task.hidden || false,
      }));
      setTasks(parsedTasks);
    }
    const savedTheme = localStorage.getItem(`lifeAdminTheme_${user.id}`) || defaultTheme;
    setCurrentTheme(savedTheme);

    const savedDarkMode = localStorage.getItem(`lifeAdminDarkMode_${user.id}`) === 'true';
    setIsDarkMode(savedDarkMode);

    const savedLightness = localStorage.getItem(`lifeAdminBgLightness_${user.id}`);
    if (savedLightness) {
      setBackgroundLightness(JSON.parse(savedLightness));
    } else {
      setBackgroundLightness(savedDarkMode ? 15 : 96);
    }
    
    const savedCardLightness = localStorage.getItem(`lifeAdminCardLightness_${user.id}`);
    if (savedCardLightness) {
      setCardLightness(JSON.parse(savedCardLightness));
    } else {
      setCardLightness(savedDarkMode ? 18 : 94);
    }

    const savedLevel = localStorage.getItem(`lifeAdminUserLevel_${user.id}`);
    const savedXp = localStorage.getItem(`lifeAdminUserXp_${user.id}`);
    const savedChallenges = localStorage.getItem(`lifeAdminChallenges_${user.id}`);
    const savedStartedChallenges = localStorage.getItem(`lifeAdminStartedChallenges_${user.id}`);

    if (savedLevel) setUserLevel(JSON.parse(savedLevel));
    if (savedXp) setUserXp(JSON.parse(savedXp));
    if (savedStartedChallenges) setHasStartedChallenges(JSON.parse(savedStartedChallenges));
    if (savedChallenges) {
      const parsedChallenges: { id: number, completed: boolean }[] = JSON.parse(savedChallenges);
      const challengeMap = new Map(parsedChallenges.map(c => [c.id, c.completed]));
      setChallenges(ALL_CHALLENGES_DEFINITIONS.map(c => ({
        ...c,
        completed: challengeMap.get(c.id) || false
      })));
    } else {
      setChallenges(ALL_CHALLENGES_DEFINITIONS.map(c => ({ ...c, completed: false })));
    }
  }, [user]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', isDarkMode);
    applyTheme(currentTheme, isDarkMode, backgroundLightness, cardLightness);
  }, [isDarkMode, currentTheme, backgroundLightness, cardLightness]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`lifeAdminTasks_${user.id}`, JSON.stringify(tasks));
      localStorage.setItem(`lifeAdminTheme_${user.id}`, currentTheme);
      localStorage.setItem(`lifeAdminDarkMode_${user.id}`, isDarkMode.toString());
      localStorage.setItem(`lifeAdminBgLightness_${user.id}`, JSON.stringify(backgroundLightness));
      localStorage.setItem(`lifeAdminCardLightness_${user.id}`, JSON.stringify(cardLightness));
      localStorage.setItem(`lifeAdminUserLevel_${user.id}`, JSON.stringify(userLevel));
      localStorage.setItem(`lifeAdminUserXp_${user.id}`, JSON.stringify(userXp));
      localStorage.setItem(`lifeAdminChallenges_${user.id}`, JSON.stringify(challenges));
      localStorage.setItem(`lifeAdminStartedChallenges_${user.id}`, JSON.stringify(hasStartedChallenges));
    }
  }, [tasks, currentTheme, isDarkMode, backgroundLightness, cardLightness, userLevel, userXp, challenges, hasStartedChallenges, user]);

  useEffect(() => {
    if (currentTheme === 'gold') {
      document.body.classList.add('theme-gold');
    } else {
      document.body.classList.remove('theme-gold');
    }
  }, [currentTheme]);

  // Auto-unlock gold theme for Avi rank (level 100+)
  useEffect(() => {
    if (userLevel >= 100 && currentTheme !== 'gold') {
      setCurrentTheme('gold');
      if (user) {
        localStorage.setItem(`lifeAdminTheme_${user.id}`, 'gold');
      }
    }
  }, [userLevel, currentTheme, user]);

  const checkChallenges = useCallback((currentTasks: Task[]) => {
    if (!hasStartedChallenges) return; // Only check challenges if user has started
    
    const completedTasks = currentTasks.filter(t => t.completed);
    const completedCategories = new Set(completedTasks.map(t => t.category.trim()).filter(Boolean));
    let xpGained = 0;
    
    const getChallengeLevel = (challengeId: number) => {
        if (challengeId <= 7) return 1;
        if (challengeId <= 14) return 2;
        if (challengeId <= 21) return 3;
        if (challengeId <= 28) return 4;
        if (challengeId <= 35) return 5;
        if (challengeId <= 42) return 6;
        if (challengeId <= 49) return 7;
        if (challengeId <= 56) return 8;
        if (challengeId <= 63) return 9;
        if (challengeId <= 70) return 10;
        return 11;
    };

    const updatedChallenges = challenges.map(challenge => {
      const challengeLevel = getChallengeLevel(challenge.id);
      if (challenge.completed || userLevel < challengeLevel) return challenge;

      if (challenge.check(completedTasks, completedCategories)) {
        xpGained += challenge.xp;
        toast.success(`Challenge complete: ${challenge.text}`, {
          description: `You earned ${challenge.xp} XP!`,
        });
        return { ...challenge, completed: true };
      }
      return challenge;
    });

    if (xpGained > 0) {
      setUserXp(prevXp => {
        let totalXp = prevXp + xpGained;
        let currentLevel = userLevel;
        let levelsGained = 0;
        
        while (totalXp >= currentLevel * XP_FOR_LEVEL) {
          totalXp -= currentLevel * XP_FOR_LEVEL;
          currentLevel++;
          levelsGained++;
          setUserLevel(currentLevel);
          toast.info(`Congratulations! You've reached Level ${currentLevel}!`);
          
          // Give 3 themes per level up
          if (levelsGained > 0) {
            const themesPerLevel = 3;
            const newThemeCount = Math.min(themesPerLevel, themes.length - ((currentLevel - 2) * 3));
            if (newThemeCount > 0) {
              const startIndex = (currentLevel - 2) * 3;
              const endIndex = Math.min(startIndex + 3, 12); // Max 12 for regular ranks
              const unlockedThemeNames = themes.slice(startIndex, endIndex).map(t => t.name);
              toast.success(`New themes unlocked: ${unlockedThemeNames.join(', ')}!`, {
                description: 'You can change them in Settings.',
              });
            }
          }
        }
        return totalXp;
      });
    }

    setChallenges(updatedChallenges);
  }, [challenges, userLevel, hasStartedChallenges]);

  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setTasks(prev => [...prev, task].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()));
    navigate('/');
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => {
      const newTasks = prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      );
      const toggledTask = newTasks.find(t => t.id === taskId);
      if (toggledTask?.completed && hasStartedChallenges) {
        checkChallenges(newTasks);
      }
      return newTasks;
    });
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const editTask = (taskId: string, updatedTask: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, ...updatedTask }
          : task
      ).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    );
  };

  const hideTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, hidden: true } : task
      )
    );
    toast.info("Task hidden.");
  };

  const restoreTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, hidden: false } : task
      )
    );
    toast.success("Task restored.");
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    if (user) {
      localStorage.setItem(`lifeAdminTheme_${user.id}`, theme);
    }
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => {
        const newIsDarkMode = !prev;
        setBackgroundLightness(newIsDarkMode ? 15 : 96); // reset to default on toggle
        setCardLightness(newIsDarkMode ? 18 : 94);
        return newIsDarkMode;
    });
  };

  const handleBackgroundLightnessChange = (lightness: number) => {
    setBackgroundLightness(lightness);
  };

  const handleCardLightnessChange = (lightness: number) => {
    setCardLightness(lightness);
  };

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleStartOver = async () => {
    await supabase.auth.signOut();
    if(user) {
        localStorage.removeItem(`lifeAdminTasks_${user.id}`);
        localStorage.removeItem(`lifeAdminTheme_${user.id}`);
        localStorage.removeItem(`lifeAdminDarkMode_${user.id}`);
        localStorage.removeItem(`lifeAdminUserLevel_${user.id}`);
        localStorage.removeItem(`lifeAdminUserXp_${user.id}`);
        localStorage.removeItem(`lifeAdminChallenges_${user.id}`);
        localStorage.removeItem(`lifeAdminBgLightness_${user.id}`);
        localStorage.removeItem(`lifeAdminCardLightness_${user.id}`);
        localStorage.removeItem(`lifeAdminStartedChallenges_${user.id}`);
    }

    setTasks([]);
    setCurrentTheme(defaultTheme);
    setIsDarkMode(false);
    setBackgroundLightness(96);
    setCardLightness(94);
    setUserLevel(1);
    setUserXp(0);
    setChallenges(ALL_CHALLENGES_DEFINITIONS.map(c => ({...c, completed: false})));
    setHasStartedChallenges(false);
    
    navigate('/landing', { replace: true });
    toast.info("App has been reset. Welcome back!");
  };
  
  const handleUnlockAll = () => {
    setUserLevel(100);
    setUserXp(0);
    setHasStartedChallenges(true);
    // Unlock and auto-apply gold theme
    setCurrentTheme('gold');
    if (user) {
      localStorage.setItem(`lifeAdminTheme_${user.id}`, 'gold');
    }
    toast.success("Cheats activated! Everything unlocked.", {
        description: "Enjoy your god-like status! Gold theme applied!",
    });
  };

  const handleStartChallenges = () => {
    setHasStartedChallenges(true);
    toast.success("Welcome to the challenge system!", {
      description: "You unlocked Purple, Teal, and Orange themes to get you started!",
    });
  };

  const handleUpdateProfile = async (updatedProfileData: Partial<Profile>, avatarFile?: File) => {
    if (!user) return;

    let avatar_url: string | undefined = undefined;

    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${fileName}`;

      toast.info("Uploading new avatar...");
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        toast.error('Failed to upload avatar.');
        console.error(uploadError);
        return;
      }

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      avatar_url = `${urlData.publicUrl}?t=${new Date().getTime()}`;
    }

    const updates = {
      ...updatedProfileData,
      ...(avatar_url && { avatar_url }),
      updated_at: new Date().toISOString(),
    };
    
    if (Object.keys(updates).length <= 1 && !avatar_url) {
        // Only updated_at is present, nothing to update
        return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      toast.error('Failed to update profile.');
      console.error(error);
    } else if (data) {
      setProfile(data as unknown as Profile);
      toast.success('Profile updated successfully!');
    }
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/landing');
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<PublicRoute session={session} />}>
            <Route path="/landing" element={<PageTransition><LandingPage onGetStarted={handleGetStarted} currentTheme={currentTheme} /></PageTransition>} />
            <Route path="/auth" element={<PageTransition><AuthPage /></PageTransition>} />
          </Route>
          
          <Route element={<ProtectedRoute session={session} />}>
            <Route 
              element={
                <MainLayout 
                  onThemeChange={handleThemeChange} 
                  currentTheme={currentTheme} 
                  profile={profile} 
                  showGreeting={showGreeting} 
                  onUpdateProfile={handleUpdateProfile}
                />
              }
            >
              <Route path="/" element={<PageTransition><DashboardPage tasks={tasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} onEditTask={editTask} onHideTask={hideTask} /></PageTransition>} />
              <Route path="/add-task" element={<PageTransition><AddTaskPage onAddTask={addTask} onBack={() => navigate(-1)} currentTheme={currentTheme} profile={profile} /></PageTransition>} />
              <Route path="/calendar" element={<PageTransition><CalendarPage tasks={tasks} onBack={() => navigate(-1)} /></PageTransition>} />
              <Route path="/challenges" element={
                <PageTransition>
                  <ChallengePage 
                    userLevel={userLevel}
                    userXp={userXp}
                    xpToNextLevel={userLevel * XP_FOR_LEVEL}
                    challenges={challenges}
                    hasStartedChallenges={hasStartedChallenges}
                    onStartChallenges={handleStartChallenges}
                    onBack={() => navigate(-1)}
                  />
                </PageTransition>
              } />
              <Route path="/tasks/:filter" element={
                <PageTransition>
                  <TasksViewPage 
                    tasks={tasks}
                    onToggleTask={toggleTask}
                    onDeleteTask={deleteTask}
                    onEditTask={editTask}
                    onHideTask={hideTask}
                    onBack={() => navigate(-1)}
                    applyTheme={(theme) => applyTheme(theme, isDarkMode)}
                    currentTheme={currentTheme}
                  />
                </PageTransition>
              } />
              <Route path="/settings" element={
                <PageTransition>
                  <SettingsPage 
                    onBack={() => navigate('/')} 
                    currentTheme={currentTheme}
                    onThemeChange={handleThemeChange}
                    isDarkMode={isDarkMode}
                    onToggleDarkMode={handleToggleDarkMode}
                    onStartOver={handleStartOver}
                    userLevel={userLevel}
                    user={user}
                    onSignOut={handleSignOut}
                    backgroundLightness={backgroundLightness}
                    onBackgroundLightnessChange={handleBackgroundLightnessChange}
                    cardLightness={cardLightness}
                    onCardLightnessChange={handleCardLightnessChange}
                    tasks={tasks}
                    onRestoreTask={restoreTask}
                    onUnlockAll={handleUnlockAll}
                  />
                </PageTransition>
              } />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to={session ? "/" : "/landing"} replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default Index;