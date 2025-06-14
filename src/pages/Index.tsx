
import { useState, useEffect } from 'react';
import { TaskDashboard } from '../components/TaskDashboard';
import { AddTaskPage } from './AddTaskPage';
import { TaskList } from '../components/TaskList';
import { Header } from '../components/Header';
import { LandingPage } from '../components/LandingPage';
import { CalendarPage } from './CalendarPage';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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
  const [currentTheme, setCurrentTheme] = useState('purple');

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

  const getThemeGradient = (theme: string) => {
    switch (theme) {
      case 'teal': return 'bg-gradient-teal';
      case 'orange': return 'bg-gradient-orange';
      case 'pink': return 'bg-gradient-pink';
      case 'blue': return 'bg-gradient-success';
      case 'green': return 'bg-gradient-warning';
      default: return 'bg-gradient-purple';
    }
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem('lifeAdminTheme', theme);
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

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('lifeAdminTheme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

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
    <div className="min-h-screen bg-white">
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
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Your Tasks</h2>
          <Button 
            onClick={handleAddTaskClick}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
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
