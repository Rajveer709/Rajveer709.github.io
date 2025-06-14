
import { useState } from 'react';
import { Task } from './Index';
import { TaskDashboard } from '../components/TaskDashboard';
import { TaskList } from '../components/TaskList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardPageProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void;
}

export const DashboardPage = ({ tasks, onToggleTask, onDeleteTask, onEditTask }: DashboardPageProps) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const handleAddTaskClick = () => {
    navigate('/add-task');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') {
      return !task.completed;
    }
    if (filter === 'completed') {
      return task.completed;
    }
    return true; // 'all'
  });

  return (
    <>
      <div className="mb-6 md:mb-8">
        <TaskDashboard tasks={tasks} />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-primary">Your Tasks</h2>
        <Button 
          onClick={handleAddTaskClick}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
          All Tasks
        </Button>
        <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>
          Pending
        </Button>
        <Button variant={filter === 'completed' ? 'default' : 'outline'} onClick={() => setFilter('completed')}>
          Completed
        </Button>
      </div>

      <TaskList 
        tasks={filteredTasks}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
        onEditTask={onEditTask}
      />
    </>
  );
};
