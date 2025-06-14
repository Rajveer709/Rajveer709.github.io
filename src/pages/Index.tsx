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

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
}

import { FunctionalChallengePage, Challenge as ChallengeWithCompleted } from './FunctionalChallengePage';

export type Challenge = ChallengeWithCompleted;

const XP_FOR_LEVEL = 100;

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/landing';

  const [userLevel, setUserLevel] = useState(1);
  const [userXp, setUserXp] = useState(0);
  const [challenges, setChallenges] = useState<Challenge[]>(
    ALL_CHALLENGES_DEFINITIONS.map(c => ({...c, completed: false}))
  );

  const applyTheme = useCallback((themeValue: string, isDark: boolean) => {
    const theme = themes.find(t => t.value === themeValue) || themes.find(t => t.value === defaultTheme);
    if (!theme) return;

    const root = document.documentElement;
    const primaryHsl = hexToHsl(theme.colors.primary);

    if (primaryHsl) {
        root.style.setProperty('--primary', `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
        root.style.setProperty('--ring', `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
        if (isDark) {
          root.style.setProperty('--background', `${primaryHsl.h} ${primaryHsl.s * 0.15}% 8%`);
          root.style.setProperty('--card', `${primaryHsl.h} ${primaryHsl.s * 0.25}% 12%`);
        } else {
          root.style.setProperty('--background', `${primaryHsl.h} 20% 99%`);
          root.style.setProperty('--card', `${primaryHsl.h} 40% 97%`);
        }
    }
  }, []);

  useEffect(() => {
    const savedTasks = localStorage.getItem('lifeAdminTasks');
    const hasTasks = savedTasks && JSON.parse(savedTasks).length > 0;
    const userHasOnboarded = sessionStorage.getItem('userHasOnboarded') === 'true';

    if (isLandingPage && hasTasks) {
      navigate('/', { replace: true });
    } else if (!isLandingPage && !hasTasks && !userHasOnboarded) {
      navigate('/landing', { replace: true });
    }
  }, [isLandingPage, navigate]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('lifeAdminTasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt)
      }));
      setTasks(parsedTasks);
    }
    const savedTheme = localStorage.getItem('lifeAdminTheme') || defaultTheme;
    setCurrentTheme(savedTheme);

    const savedDarkMode = localStorage.getItem('lifeAdminDarkMode') === 'true';
    setIsDarkMode(savedDarkMode);

    const savedLevel = localStorage.getItem('lifeAdminUserLevel');
    const savedXp = localStorage.getItem('lifeAdminUserXp');
    const savedChallenges = localStorage.getItem('lifeAdminChallenges');

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
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', isDarkMode);
    localStorage.setItem('lifeAdminDarkMode', isDarkMode.toString());
    applyTheme(currentTheme, isDarkMode);
  }, [isDarkMode, currentTheme, applyTheme]);

  useEffect(() => {
    localStorage.setItem('lifeAdminTasks', JSON.stringify(tasks));
  }, [tasks]);
  
  useEffect(() => {
    localStorage.setItem('lifeAdminUserLevel', JSON.stringify(userLevel));
    localStorage.setItem('lifeAdminUserXp', JSON.stringify(userXp));
    localStorage.setItem('lifeAdminChallenges', JSON.stringify(challenges));
  }, [userLevel, userXp, challenges]);

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

  const handleThemeChange = useCallback((theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem('lifeAdminTheme', theme);
  }, []);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleGetStarted = () => {
    sessionStorage.setItem('userHasOnboarded', 'true');
    navigate('/');
  };

  const handleStartOver = () => {
    localStorage.removeItem('lifeAdminTasks');
    localStorage.removeItem('lifeAdminTheme');
    localStorage.removeItem('lifeAdminDarkMode');
    localStorage.removeItem('lifeAdminUserLevel');
    localStorage.removeItem('lifeAdminUserXp');
    localStorage.removeItem('lifeAdminChallenges');
    sessionStorage.removeItem('userHasOnboarded');

    setTasks([]);
    setCurrentTheme(defaultTheme);
    setIsDarkMode(false);
    setUserLevel(1);
    setUserXp(0);
    setChallenges(ALL_CHALLENGES_DEFINITIONS.map(c => ({...c, completed: false})));
    
    navigate('/landing', { replace: true });
    toast.info("App has been reset. Welcome back!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/landing" element={<LandingPage onGetStarted={handleGetStarted} />} />
        
        <Route path="*" element={
          <>
            <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl pb-20 md:pb-8">
              <Header onThemeChange={handleThemeChange} currentTheme={currentTheme} onCalendarClick={() => navigate('/calendar')} />
              <main>
                <Routes>
                  <Route path="/" element={<DashboardPage tasks={tasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} onEditTask={editTask} />} />
                  <Route path="/add-task" element={<AddTaskPage onAddTask={addTask} onBack={() => navigate(-1)} currentTheme={currentTheme} />} />
                  <Route path="/calendar" element={<CalendarPage tasks={tasks} onBack={() => navigate(-1)} currentTheme={currentTheme} />} />
                  <Route path="/challenges" element={
                    <FunctionalChallengePage 
                      userLevel={userLevel}
                      userXp={userXp}
                      xpToNextLevel={userLevel * XP_FOR_LEVEL}
                      challenges={challenges}
                      onBack={() => navigate(-1)}
                    />
                  } />
                  <Route path="/tasks/:filter" element={
                    <TasksViewPage 
                      tasks={tasks}
                      onToggleTask={toggleTask}
                      onDeleteTask={deleteTask}
                      onEditTask={editTask}
                      onBack={() => navigate(-1)}
                      applyTheme={(theme) => applyTheme(theme, isDarkMode)}
                      currentTheme={currentTheme}
                    />
                  } />
                  <Route path="/settings" element={
                    <SettingsPage 
                      onBack={() => navigate('/')} 
                      currentTheme={currentTheme}
                      onThemeChange={handleThemeChange}
                      isDarkMode={isDarkMode}
                      onToggleDarkMode={handleToggleDarkMode}
                      onStartOver={handleStartOver}
                      userLevel={userLevel}
                    />
                  } />
                </Routes>
              </main>
            </div>
            <BottomNavBar />
          </>
        } />
      </Routes>
    </div>
  );
};

export default Index;
