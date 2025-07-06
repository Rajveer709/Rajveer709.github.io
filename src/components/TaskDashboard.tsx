import { useNavigate } from 'react-router-dom';
import { Task } from '../pages/Index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  DollarSign, 
  Heart, 
  Home, 
  User, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface TaskDashboardProps {
  tasks: Task[];
}

const categoryIcons: { [key: string]: any } = {
  'Financial': DollarSign,
  'Health & Wellness': Heart,
  'Household': Home,
  'Personal': User,
  'Legal & Admin': FileText
};

const categoryColors: { [key: string]: string } = {
  'Financial': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
  'Health & Wellness': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
  'Household': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
  'Personal': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800',
  'Legal & Admin': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800'
};

export const TaskDashboard = ({ tasks }: TaskDashboardProps) => {
  const navigate = useNavigate();
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const overdueTasks = tasks.filter(task => 
    !task.completed && new Date(task.dueDate) < new Date()
  ).length;
  const upcomingTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return !task.completed && taskDate >= today && taskDate <= nextWeek;
  }).length;

  const categoryCounts = tasks.reduce((acc, task) => {
    if (!task.completed) {
      acc[task.category] = (acc[task.category] || 0) + 1;
    }
    return acc;
  }, {} as { [key: string]: number });

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Overview Cards - Compact */}
      <Card 
        className="bg-blue-50 dark:bg-blue-500/10 border-0 shadow-sm hover:shadow-md hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all duration-300 cursor-pointer"
        onClick={() => navigate('/tasks/all')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">Total</CardTitle>
          <CheckCircle className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{totalTasks}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {completedTasks} done
          </p>
        </CardContent>
      </Card>

      <Card 
        className="bg-orange-50 dark:bg-orange-500/10 border-0 shadow-sm hover:shadow-md hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-all duration-300 cursor-pointer"
        onClick={() => navigate('/tasks/due-soon')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">Due Soon</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xl font-bold text-orange-600 dark:text-orange-400">{upcomingTasks}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This week
          </p>
        </CardContent>
      </Card>

      <Card 
        className="bg-red-50 dark:bg-destructive/25 border-0 shadow-sm hover:shadow-md hover:bg-red-100 dark:hover:bg-destructive/35 transition-all duration-300 cursor-pointer"
        onClick={() => navigate('/tasks/overdue')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">Overdue</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xl font-bold text-destructive">{overdueTasks}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Need attention
          </p>
        </CardContent>
      </Card>

      <Card 
        className="bg-green-50 dark:bg-green-500/10 border-0 shadow-sm hover:shadow-md hover:bg-green-100 dark:hover:bg-green-500/20 transition-all duration-300 cursor-pointer"
        onClick={() => navigate('/tasks/completed')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">Complete</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            {completedTasks}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            of {totalTasks}
          </p>
        </CardContent>
      </Card>

      {/* Category Breakdown - Compact */}
      <Card className="col-span-full bg-card/80 dark:bg-card/30 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-800 dark:text-gray-200">Active by Category</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryCounts).map(([category, count]) => {
              const Icon = categoryIcons[category] || FileText;
              return (
                <Badge 
                  key={category} 
                  variant="outline"
                  className={`${categoryColors[category] || 'bg-gray-100 text-gray-800'} px-2 py-1 text-xs font-medium flex items-center gap-1`}
                >
                  <Icon className="w-3 h-3" />
                  {category}: {count}
                </Badge>
              );
            })}
            {Object.keys(categoryCounts).length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-xs">No active tasks</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};