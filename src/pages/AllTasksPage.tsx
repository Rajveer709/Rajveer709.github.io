
import { Task } from './Index';
import { TaskList } from '../components/TaskList';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AllTasksPageProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void;
  onBack: () => void;
}

export const AllTasksPage = ({ tasks, onToggleTask, onDeleteTask, onEditTask, onBack }: AllTasksPageProps) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">All Tasks</h1>
      </div>
      <TaskList
        tasks={tasks}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
        onEditTask={onEditTask}
      />
    </div>
  );
};
