
import { Task } from './Index';
import { TaskList } from '../components/TaskList';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardPageProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void;
  onHideTask: (taskId: string) => void;
}

export const DashboardPage = ({ 
  tasks, 
  onToggleTask, 
  onDeleteTask, 
  onEditTask, 
  onHideTask 
}: DashboardPageProps) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Progress Card - Portrait Optimized */}
      <Card className="bg-card/80 dark:bg-card/30 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-4 mb-2">
            <Progress 
              value={completionPercentage} 
              className="h-3 flex-1"
              indicatorClassName={
                completionPercentage === 100 
                  ? 'animate-pulse-glow' 
                  : 'shadow-[0_0_10px_hsl(var(--primary))]'
              }
            />
            <span className="text-xl font-bold text-primary min-w-[3rem]">
              {completionPercentage}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </CardContent>
      </Card>

      {/* Task List - Full Width for Portrait */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-primary">Your Tasks</h2>
        </div>
        <TaskList 
          tasks={tasks}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onHideTask={onHideTask}
        />
      </div>
    </div>
  );
};
