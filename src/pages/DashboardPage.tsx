
import { Task } from './Index';
import { TaskDashboard } from '../components/TaskDashboard';
import { TaskList } from '../components/TaskList';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOutletContext } from "react-router-dom";
import { themes, defaultTheme } from '../config/themes';
import { CheckSquare, TrendingUp } from 'lucide-react';

interface DashboardPageProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void;
  onHideTask: (taskId: string) => void;
}

interface OutletContextType {
  currentTheme?: string;
}

export const DashboardPage = ({ 
  tasks, 
  onToggleTask, 
  onDeleteTask, 
  onEditTask, 
  onHideTask 
}: DashboardPageProps) => {
  const { currentTheme = 'purple' } = useOutletContext<OutletContextType>();
  const theme = themes.find(t => t.value === currentTheme) || themes.find(t => t.value === defaultTheme);
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div>
        <div className="flex justify-between items-center gap-4 mb-4 md:mb-6">
          <h2 
            className="text-xl md:text-2xl font-semibold bg-gradient-to-r bg-clip-text text-transparent flex items-center gap-2"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            <CheckSquare className="w-5 h-5 md:w-6 md:h-6" style={{ color: theme?.colors.primary }} />
            Your Tasks
          </h2>
        </div>
        <TaskList 
          tasks={tasks}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onHideTask={onHideTask}
        />
      </div>

      <div className="space-y-4 md:space-y-6">
        <Card className="bg-card/80 dark:bg-card/30 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2 pt-4">
            <CardTitle 
              className="text-base md:text-lg font-medium bg-gradient-to-r bg-clip-text text-transparent flex items-center gap-2"
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
              }}
            >
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5" style={{ color: theme?.colors.primary }} />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3 md:gap-4">
              <Progress 
                value={completionPercentage} 
                className="h-2 md:h-3 flex-1"
                indicatorStyle={
                  completionPercentage === 100 
                    ? { 
                        backgroundColor: theme?.colors.primary,
                        animation: 'pulse 2s infinite'
                      } 
                    : { 
                        backgroundColor: theme?.colors.primary,
                        boxShadow: `0 0 10px ${theme?.colors.primary}`
                      }
                }
              />
              <span 
                className="text-base md:text-lg font-bold"
                style={{ color: theme?.colors.primary }}
              >
                {completionPercentage}%
              </span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {completedTasks} of {totalTasks} tasks completed.
            </p>
          </CardContent>
        </Card>
        
        <TaskDashboard tasks={tasks} />
      </div>
    </div>
  );
};
