
import { Task } from '../pages/Index';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void;
  onHideTask: (taskId: string) => void;
}

export const TaskList = ({ tasks, onToggleTask, onDeleteTask, onEditTask, onHideTask }: TaskListProps) => {
  const visibleTasks = tasks.filter(task => !task.hidden);
  // Sort tasks: incomplete first (by due date), then completed
  const sortedTasks = [...visibleTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  if (visibleTasks.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No tasks yet</h3>
          <p className="text-gray-600">Get started by adding your first life admin task!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedTasks.map((task, index) => (
        <div key={task.id} className="animate-fade-in" style={{ animationDelay: `${Math.min(index * 100, 500)}ms`}}>
            <TaskCard
              task={task}
              onToggle={() => onToggleTask(task.id)}
              onDelete={() => onDeleteTask(task.id)}
              onEdit={(updatedTask) => onEditTask(task.id, updatedTask)}
              onHide={() => onHideTask(task.id)}
            />
        </div>
      ))}
    </div>
  );
};
