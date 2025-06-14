import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Task } from './Index';
import { TaskList } from '../components/TaskList';
import { hexToHsl } from '../lib/colorUtils';
import { PageHeader } from '../components/PageHeader';

interface TasksViewPageProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void;
  onHideTask: (taskId: string) => void;
  onBack: () => void;
  applyTheme: (theme: string) => void;
  currentTheme: string;
}

const filterConfig: { [key: string]: { title: string; filterFn: (task: Task) => boolean } } = {
  all: {
    title: 'All Tasks',
    filterFn: () => true,
  },
  overdue: {
    title: 'Overdue Tasks',
    filterFn: (task) => !task.completed && new Date(task.dueDate) < new Date(),
  },
  'due-soon': {
    title: 'Tasks Due Soon',
    filterFn: (task) => {
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return !task.completed && taskDate >= today && taskDate <= nextWeek;
    },
  },
  completed: {
    title: 'Completed Tasks',
    filterFn: (task) => task.completed,
  },
};

export const TasksViewPage = ({ tasks, onToggleTask, onDeleteTask, onEditTask, onBack, applyTheme, currentTheme, onHideTask }: TasksViewPageProps) => {
  const { filter } = useParams<{ filter: string }>();
  const currentConfig = filterConfig[filter || 'all'] || filterConfig.all;
  
  const filteredTasks = tasks.filter(currentConfig.filterFn);

  useEffect(() => {
    const originalTheme = currentTheme;
    const root = document.documentElement;

    const applyCustomTheme = (hex: string) => {
      const isDark = root.classList.contains('dark');
      const primaryHsl = hexToHsl(hex);
      if (primaryHsl) {
        root.style.setProperty('--primary', `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
        root.style.setProperty('--ring', `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
        if (isDark) {
          root.style.setProperty('--background', `${primaryHsl.h} ${primaryHsl.s * 0.3}% 12%`);
          root.style.setProperty('--card', `${primaryHsl.h} ${primaryHsl.s * 0.4}% 15%`);
        } else {
          root.style.setProperty('--background', `${primaryHsl.h} 50% 96%`);
          root.style.setProperty('--card', `${primaryHsl.h} 60% 94%`);
        }
      }
    };

    if (filter === 'due-soon') {
      applyTheme('orange');
    } else if (filter === 'overdue') {
      applyCustomTheme('#dc2626'); // More intense red
    } else if (filter === 'completed') {
      applyCustomTheme('#16a34a'); // Darker green
    } else if (filter === 'all') {
      applyTheme('blue');
    } else {
      applyTheme(originalTheme);
    }

    return () => {
      applyTheme(originalTheme);
    };
  }, [filter, applyTheme, currentTheme]);

  return (
    <div>
      <PageHeader onBack={onBack} title={currentConfig.title} />
      <TaskList
        tasks={filteredTasks}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
        onEditTask={onEditTask}
        onHideTask={onHideTask}
      />
    </div>
  );
};
