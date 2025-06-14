import { Task } from '../pages/Index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
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
  'Financial': 'bg-green-100 text-green-800 border-green-200',
  'Health & Wellness': 'bg-red-100 text-red-800 border-red-200',
  'Household': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Personal': 'bg-purple-100 text-purple-800 border-purple-200',
  'Legal & Admin': 'bg-blue-100 text-blue-800 border-blue-200'
};

export const TaskDashboard = ({ tasks }: TaskDashboardProps) => {
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
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-600">Total Tasks</CardTitle>
          <CheckCircle className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-primary">{totalTasks}</div>
          <p className="text-xs text-gray-500">
            {completedTasks} completed
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-600">Overdue</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-destructive">{overdueTasks}</div>
          <p className="text-xs text-gray-500">
            Need attention
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-600">Due This Week</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-orange-600">{upcomingTasks}</div>
          <p className="text-xs text-gray-500">
            Coming up soon
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-600">Completion</CardTitle>
          <Calendar className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
            <div className="text-xl md:text-2xl font-bold text-green-600">
              {completionPercentage}%
            </div>
            <Progress value={completionPercentage} className="h-2 mt-2" />
            <p className="text-xs text-gray-500 mt-1">
              {completedTasks} of {totalTasks} tasks
            </p>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="col-span-full bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Active Tasks by Category</CardTitle>
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
              <p className="text-gray-500 text-sm">No active tasks</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
