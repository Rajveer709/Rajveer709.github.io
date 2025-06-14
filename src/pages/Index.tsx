import { useState, useEffect } from 'react';
import { TaskDashboard } from '../components/TaskDashboard';
import { AddTaskPage } from './AddTaskPage';
import { TaskList } from '../components/TaskList';
import { Header } from '../components/Header';
import { LandingPage } from '../components/LandingPage';
import { CalendarPage } from './CalendarPage';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
  const [showApp, setShowApp] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

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

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('lifeAdminTasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt)
      }));
      setTasks(parsedTasks);
      // If user has tasks, show the app directly
      if (parsedTasks.length > 0) {
        setShowApp(true);
      }
    }
    const savedTheme = localStorage.getItem('lifeAdminTheme') || defaultTheme;
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('lifeAdminTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setTasks(prev => [...prev, task]);
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
      )
    );
  };

  const handleGetStarted = () => {
    setShowApp(true);
  };

  const getThemeBackgroundStyle = () => {
    const theme = themes.find(t => t.value === currentTheme) || themes.find(t => t.value === defaultTheme);
    if (!theme) return {};

    const primaryColor = theme.colors.primary;
    const r = parseInt(primaryColor.slice(1, 3), 16);
    const g = parseInt(primaryColor.slice(3, 5), 16);
    const b = parseInt(primaryColor.slice(5, 7), 16);
    
    return {
        background: `linear-gradient(to bottom, rgba(${r}, ${g}, ${b}, 0.1), white)`
    };
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem('lifeAdminTheme', theme);
    applyTheme(theme);
  };

  const handleCalendarClick = () => {
    setShowCalendar(true);
  };

  const handleBackFromCalendar = () => {
    setShowCalendar(false);
  };

  const handleAddTaskClick = () => {
    setShowAddTask(true);
  };

  const handleBackFromAddTask = () => {
    setShowAddTask(false);
  };

  if (!showApp) {
    return <LandingPage onGetStarted={handleGetStarted} currentTheme={currentTheme} />;
  }

  if (showCalendar) {
    return (
      <CalendarPage 
        tasks={tasks} 
        onBack={handleBackFromCalendar} 
        currentTheme={currentTheme}
      />
    );
  }

  if (showAddTask) {
    return (
      <AddTaskPage 
        onAddTask={addTask}
        onBack={handleBackFromAddTask}
        currentTheme={currentTheme}
      />
    );
  }

  return (
    <div className="min-h-screen" style={getThemeBackgroundStyle()}>
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        <Header 
          onThemeChange={handleThemeChange} 
          currentTheme={currentTheme}
          onCalendarClick={handleCalendarClick}
        />
        
        <div className="mb-6 md:mb-8">
          <TaskDashboard tasks={tasks} />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-primary">Your Tasks</h2>
          <Button 
            onClick={handleAddTaskClick}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        <TaskList 
          tasks={tasks}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onEditTask={editTask}
        />
      </div>
    </div>
  );
};

export default Index;
