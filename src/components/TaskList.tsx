import { Task } from '../pages/Index';
import { TaskCard } from './TaskCard';
import { Card, CardContent } from '@/components/ui/card';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void;
  onHideTask: (taskId: string) => void;
}

export const TaskList = ({ 
  tasks, 
  onToggleTask, 
  onDeleteTask, 
  onEditTask, 
  onHideTask 
}: TaskListProps) => {
  const visibleTasks = tasks.filter(task => !task.hidden);
  
  // Sort tasks: incomplete first (by priority then due date), then completed
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  
  const sortedTasks = [...visibleTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // For incomplete tasks, sort by priority first, then by due date
    if (!a.completed && !b.completed) {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
    }
    
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  if (visibleTasks.length === 0) {
    return (
      <Card className="bg-card/80 dark:bg-card/30 backdrop-blur-sm border-0 shadow-lg text-center animate-fade-in">
        <CardContent className="p-12">
          <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
          <p className="text-muted-foreground">Get started by adding your first life admin task!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedTasks.map((task, index) => (
        <div 
          key={task.id} 
          className="animate-fade-in" 
          style={{ animationDelay: `${Math.min(index * 100, 500)}ms` }}
        >
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