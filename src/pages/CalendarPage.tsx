
import { Task, Profile } from './Index';
import { Calendar } from '@/components/ui/calendar';
import { CheckCircle, Clock, AlertTriangle, CheckCheck } from 'lucide-react';
import { format, isSameDay, isAfter, isBefore, startOfDay } from 'date-fns';
import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useOutletContext } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { themes, defaultTheme } from '../config/themes';

interface CalendarPageProps {
  tasks: Task[];
  onBack: () => void;
}

interface OutletContextType {
  profile: Profile | null;
  onUpdateProfile: (updatedProfile: Partial<Profile>, avatarFile?: File) => Promise<void>;
  showGreeting: boolean;
  currentTheme?: string;
}

type TaskStatus = 'due' | 'completed' | 'overdue';

export const CalendarPage = ({ tasks, onBack }: CalendarPageProps) => {
  const { profile, onUpdateProfile, showGreeting, currentTheme = 'purple' } = useOutletContext<OutletContextType>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const theme = themes.find(t => t.value === currentTheme) || themes.find(t => t.value === defaultTheme);

  // Filter out hidden tasks
  const visibleTasks = tasks.filter(task => !task.hidden);

  const tasksForSelectedDate = visibleTasks.filter(task => 
    isSameDay(new Date(task.dueDate), selectedDate)
  );

  const getTaskStatus = (task: Task): TaskStatus => {
    const today = startOfDay(new Date());
    const taskDate = startOfDay(new Date(task.dueDate));
    
    if (task.completed) return 'completed';
    if (isAfter(today, taskDate)) return 'overdue';
    return 'due';
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800/50';
      case 'overdue': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800/50';
      case 'due': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/50';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800/50';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4" />;
      case 'due': return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800/50';
      case 'high': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800/50';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800/50';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800/50';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800/50';
    }
  };

  const getTaskCounts = () => {
    const counts = {
      due: 0,
      completed: 0,
      overdue: 0
    };

    tasksForSelectedDate.forEach(task => {
      const status = getTaskStatus(task);
      counts[status]++;
    });

    return counts;
  };

  const taskCounts = getTaskCounts();

  return (
    <div>
      <PageHeader
        onBack={onBack}
        title={
          <span 
            className="font-bold bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Task Calendar
          </span>
        }
        profile={profile}
        onUpdateProfile={onUpdateProfile}
        showAvatar={!showGreeting}
      />

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="bg-background/60 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-primary/20 animate-fade-in">
          <h2 
            className="text-lg font-semibold mb-4 text-center bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Select Date
          </h2>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-lg border border-primary/20 shadow-sm pointer-events-auto bg-transparent"
            />
          </div>
        </div>

        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <Card className="bg-background/60 backdrop-blur-lg border border-primary/20 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle 
                className="text-lg bg-gradient-to-r bg-clip-text text-transparent flex items-center gap-2"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
                }}
              >
                <CheckCheck className="w-5 h-5" style={{ color: theme?.colors.primary }} />
                {format(selectedDate, "MMMM d, yyyy")} Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{taskCounts.due}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Due Today</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50">
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">{taskCounts.completed}</div>
                  <div className="text-xs text-green-600 dark:text-green-400">Completed</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
                  <div className="text-xl font-bold text-red-600 dark:text-red-400">{taskCounts.overdue}</div>
                  <div className="text-xs text-red-600 dark:text-red-400">Overdue</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/60 backdrop-blur-lg border border-primary/20 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle 
                className="text-lg bg-gradient-to-r bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
                }}
              >
                Tasks for {format(selectedDate, "MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasksForSelectedDate.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No tasks scheduled for this date</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasksForSelectedDate.map((task) => {
                    const status = getTaskStatus(task);
                    return (
                      <div
                        key={task.id}
                        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getStatusColor(status)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(status)}
                              <h3 className={`font-medium ${
                                task.completed ? 'line-through opacity-75' : ''
                              }`}>
                                {task.title}
                              </h3>
                            </div>
                            {task.description && (
                              <p className="text-sm opacity-80 mb-2">{task.description}</p>
                            )}
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge 
                                variant="outline"
                                className="text-xs bg-white/50 dark:bg-black/30"
                              >
                                {task.category}
                              </Badge>
                              <Badge 
                                variant="outline"
                                className={`text-xs ${getPriorityColor(task.priority)}`}
                              >
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </Badge>
                              <Badge 
                                variant="outline"
                                className={`text-xs ${getStatusColor(status)}`}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
