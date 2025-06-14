
import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";
import { DashboardPage } from './DashboardPage';
import { AddTaskPage } from './AddTaskPage';
import { CalendarPage } from './CalendarPage';
import { SettingsPage } from './SettingsPage';
import { Header } from '../components/Header';
import { LandingPage } from '../components/LandingPage';
import { BottomNavBar } from '../components/BottomNavBar';
import { themes, defaultTheme } from '../config/themes';
import { ALL_CHALLENGES_DEFINITIONS } from '../config/challenges';
import { hexToHsl } from '../lib/colorUtils';
import { TasksViewPage } from './TasksViewPage';
import { AuthPage } from './AuthPage';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';

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

import { ChallengePage, Challenge as ChallengeWithCompleted } from './ChallengePage';

export type Challenge = ChallengeWithCompleted;

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
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
  const showGreeting = location.pathname === '/' || location.pathname === '/challenges';

  const [userLevel, setUserLevel] = useState(1);
  const [userXp, setUserXp] = useState(0);
  const [challenges, setChallenges] = useState<Challenge[]>(
    ALL_CHALLENGES_DEFINITIONS.map(c => ({...c, completed: false}))
  );

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
          root.style.setProperty('--background-gradient-start', `${primaryHsl.h} ${primaryHsl.s * 0.3}% ${bgLightness}%`);
          root.style.setProperty('--background-gradient-end', `${primaryHsl.h} ${primaryHsl.s * 0.3}% ${bgLightness - 5}%`);
          root.style.setProperty('--card', `${primaryHsl.h} ${primaryHsl.s * 0.4}% ${cardLightness}%`);
        } else {
          root.style.setProperty('--background-gradient-start', `${primaryHsl.h} 50% ${bgLightness}%`);
          root.style.setProperty('--background-gradient-end', `0 0% 100%`); // to white
          root.style.setProperty('--card', `${primaryHsl.h} 60% ${cardLightness}%`);
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
    } else if (data) {
      setProfile(data);
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
    if (!loading) {
      if (session && isAuthRoute) {
        navigate('/', { replace: true });
      } else if (!session && !isAuthRoute) {
        navigate('/landing', { replace: true });
      }
    }
  }, [session, isAuthRoute, loading, navigate]);

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

    if (savedLevel) setUserLevel(JSON.parse(savedLevel));
    if (savedXp) setUserXp(JSON.parse(savedXp));
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
    }
  }, [tasks, currentTheme, isDarkMode, backgroundLightness, cardLightness, userLevel, userXp, challenges, user]);

  const checkChallenges = useCallback((currentTasks: Task[]) => {
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
        
        while (totalXp >= currentLevel * XP_FOR_LEVEL) {
          totalXp -= currentLevel * XP_FOR_LEVEL;
          currentLevel++;
          setUserLevel(currentLevel);
          toast.info(`Congratulations! You've reached Level ${currentLevel}!`);
          const unlockedTheme = themes.find(t => t.levelToUnlock === currentLevel);
          if (unlockedTheme) {
            toast.success(`New theme unlocked: ${unlockedTheme.name}!`, {
              description: 'You can change it in the Settings.',
            });
          }
        }
        return totalXp;
      });
    }

    setChallenges(updatedChallenges);
  }, [challenges, userLevel]);

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
      if (toggledTask?.completed) {
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
    }

    setTasks([]);
    setCurrentTheme(defaultTheme);
    setIsDarkMode(false);
    setUserLevel(1);
    setUserXp(0);
    setChallenges(ALL_CHALLENGES_DEFINITIONS.map(c => ({...c, completed: false})));
    
    navigate('/landing', { replace: true });
    toast.info("App has been reset. Welcome back!");
  };
  
  const handleUpdateProfile = async (updatedProfile: Partial<Profile>) => {
    if (!user || !profile) return;

    const { data, error } = await supabase
      .from('profiles')
      .update(updatedProfile)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      toast.error('Failed to update profile.');
      console.error(error);
    } else if (data) {
      setProfile(data);
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
          <Route path="/landing" element={<PageTransition><LandingPage onGetStarted={handleGetStarted} currentTheme={currentTheme} /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><AuthPage /></PageTransition>} />
          
          <Route path="*" element={
            !session ? null : (
            <>
              <div className="container mx-auto px-4 pt-4 md:pt-6 max-w-6xl pb-20 md:pb-8">
                <Header
                  onThemeChange={handleThemeChange}
                  currentTheme={currentTheme}
                  onCalendarClick={() => navigate('/calendar')}
                  profile={profile}
                  showGreeting={showGreeting}
                />
                <main>
                  <Routes>
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
                          profile={profile}
                          onUpdateProfile={handleUpdateProfile}
                          onSignOut={handleSignOut}
                          backgroundLightness={backgroundLightness}
                          onBackgroundLightnessChange={handleBackgroundLightnessChange}
                          cardLightness={cardLightness}
                          onCardLightnessChange={handleCardLightnessChange}
                          tasks={tasks}
                          onRestoreTask={restoreTask}
                        />
                      </PageTransition>
                    } />
                  </Routes>
                </main>
              </div>
              <BottomNavBar />
            </>
            )
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default Index;
