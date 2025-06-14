
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

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const categoryCounts = tasks.reduce((acc, task) => {
    if (!task.completed) {
      acc[task.category] = (acc[task.category] || 0) + 1;
    }
    return acc;
  }, {} as { [key: string]: number });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Overview Cards */}
      <Card 
        className="bg-blue-50 dark:bg-blue-500/10 border-0 shadow-lg hover:shadow-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all duration-300 h-full cursor-pointer"
        onClick={() => navigate('/tasks/all')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</CardTitle>
          <CheckCircle className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">{totalTasks}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {completedTasks} completed
          </p>
        </CardContent>
      </Card>

      <Card 
        className="bg-orange-50 dark:bg-orange-500/10 border-0 shadow-lg hover:shadow-xl hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-all duration-300 h-full cursor-pointer"
        onClick={() => navigate('/tasks/due-soon')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Tasks</CardTitle>
          <Clock className="h-5 w-5 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400">{upcomingTasks}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Coming up soon
          </p>
        </CardContent>
      </Card>

      <Card 
        className="bg-red-50 dark:bg-destructive/25 border-0 shadow-lg hover:shadow-xl hover:bg-red-100 dark:hover:bg-destructive/35 transition-all duration-300 h-full cursor-pointer"
        onClick={() => navigate('/tasks/overdue')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">OverDue Tasks</CardTitle>
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl md:text-3xl font-bold text-destructive">{overdueTasks}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need attention
          </p>
        </CardContent>
      </Card>

      <Card 
        className="bg-green-50 dark:bg-green-500/10 border-0 shadow-lg hover:shadow-xl hover:bg-green-100 dark:hover:bg-green-500/20 transition-all duration-300 h-full cursor-pointer"
        onClick={() => navigate('/tasks/completed')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Tasks</CardTitle>
          <CheckCircle className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
              {completedTasks}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              out of {totalTasks} tasks
            </p>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="col-span-full bg-card/80 dark:bg-card/30 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">Active Tasks by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Object.entries(categoryCounts).map(([category, count]) => {
              const Icon = categoryIcons[category] || FileText;
              return (
                <Badge 
                  key={category} 
                  variant="outline"
                  className={`${categoryColors[category] || 'bg-gray-100 text-gray-800'} px-3 py-2 text-sm font-medium flex items-center gap-2`}
                >
                  <Icon className="w-4 h-4" />
                  {category}: {count}
                </Badge>
              );
            })}
            {Object.keys(categoryCounts).length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No active tasks</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
