
import { Task } from './Index';
import { TaskDashboard } from '../components/TaskDashboard';
import { TaskList } from '../components/TaskList';

interface DashboardPageProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void;
}

export const DashboardPage = ({ tasks, onToggleTask, onDeleteTask, onEditTask }: DashboardPageProps) => {

  return (
    <>
      <div className="mb-6 md:mb-8">
        <TaskDashboard tasks={tasks} />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-primary">Your Tasks</h2>
      </div>

      <TaskList 
        tasks={tasks}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
        onEditTask={onEditTask}
      />
    </>
  );
};
