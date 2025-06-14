import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { DashboardPage } from './DashboardPage';
import { AddTaskPage } from './AddTaskPage';
import { CalendarPage } from './CalendarPage';
import { SettingsPage } from './SettingsPage';
import { Header } from '../components/Header';
import { LandingPage } from '../components/LandingPage';
import { BottomNavBar } from '../components/BottomNavBar';
import { themes, defaultTheme } from '../config/themes';
import { hexToHsl } from '../lib/colorUtils';

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

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/landing';

  const applyTheme = (themeValue: string) => {
    const theme = themes.find(t => t.value === themeValue) || themes.find(t => t.value === defaultTheme);
    if (!theme) return;

    const root = document.documentElement;
    const primaryHsl = hexToHsl(theme.colors.primary);

    if (primaryHsl) {
        root.style.setProperty('--primary', `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
        root.style.setProperty('--ring', `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
    }
  };

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
    applyTheme(savedTheme);

    const savedDarkMode = localStorage.getItem('lifeAdminDarkMode') === 'true';
    setIsDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('lifeAdminDarkMode', isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('lifeAdminTasks', JSON.stringify(tasks));
  }, [tasks]);

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
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
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

  const getThemeBackgroundStyle = () => {
    const theme = themes.find(t => t.value === currentTheme) || themes.find(t => t.value === defaultTheme);
    if (!theme) return {};

    const primaryColor = theme.colors.primary;
    const r = parseInt(primaryColor.slice(1, 3), 16);
    const g = parseInt(primaryColor.slice(3, 5), 16);
    const b = parseInt(primaryColor.slice(5, 7), 16);
    
    return {
        background: `linear-gradient(to bottom, rgba(${r}, ${g}, ${b}, 0.1), hsl(var(--background)))`
    };
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem('lifeAdminTheme', theme);
    applyTheme(theme);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleGetStarted = () => {
    sessionStorage.setItem('userHasOnboarded', 'true');
    navigate('/');
  };

  return (
    <div className="min-h-screen" style={getThemeBackgroundStyle()}>
      <Routes>
        <Route path="/landing" element={<LandingPage onGetStarted={handleGetStarted} currentTheme={currentTheme} />} />
        
        <Route path="*" element={
          <>
            <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl pb-20 md:pb-8">
              <Header onThemeChange={handleThemeChange} currentTheme={currentTheme} onCalendarClick={() => navigate('/calendar')} />
              <main className="animate-fade-in">
                <Routes>
                  <Route path="/" element={<DashboardPage tasks={tasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} onEditTask={editTask} />} />
                  <Route path="/add-task" element={<AddTaskPage onAddTask={addTask} onBack={() => navigate(-1)} currentTheme={currentTheme} />} />
                  <Route path="/calendar" element={<CalendarPage tasks={tasks} onBack={() => navigate(-1)} currentTheme={currentTheme} />} />
                  <Route path="/settings" element={
                    <SettingsPage 
                      onBack={() => navigate('/')} 
                      currentTheme={currentTheme}
                      onThemeChange={handleThemeChange}
                      isDarkMode={isDarkMode}
                      onToggleDarkMode={handleToggleDarkMode}
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
