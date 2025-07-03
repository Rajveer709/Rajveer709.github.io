
import { Task, Profile } from './Index';
import { Calendar } from '@/components/ui/calendar';
import { CheckCircle, Clock, Plus, Calendar as CalendarIcon, Eye, CalendarDays } from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useOutletContext } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CalendarPageProps {
  tasks: Task[];
  onBack: () => void;
}

interface OutletContextType {
  profile: Profile | null;
  onUpdateProfile: (updatedProfile: Partial<Profile>, avatarFile?: File) => Promise<void>;
  showGreeting: boolean;
}

export const CalendarPage = ({ tasks, onBack }: CalendarPageProps) => {
  const { profile, onUpdateProfile, showGreeting } = useOutletContext<OutletContextType>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'month'>('day');

  const tasksForSelectedDate = tasks.filter(task => 
    isSameDay(new Date(task.dueDate), selectedDate)
  );

  const tasksForCurrentMonth = tasks.filter(task => 
    isSameMonth(new Date(task.dueDate), selectedDate)
  );

  const completedTasksDay = tasksForSelectedDate.filter(task => task.completed);
  const pendingTasksDay = tasksForSelectedDate.filter(task => !task.completed);

  const completedTasksMonth = tasksForCurrentMonth.filter(task => task.completed);
  const pendingTasksMonth = tasksForCurrentMonth.filter(task => !task.completed);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  const renderTaskList = (pendingTasks: Task[], completedTasks: Task[], viewType: 'day' | 'month') => (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Pending ({pendingTasks.length})
          </h4>
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              className="p-3 rounded-lg border bg-card border-border hover:border-primary/30 transition-all duration-200 group"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/40 group-hover:border-primary/60 transition-colors"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm text-foreground mb-1 line-clamp-1">
                    {task.title}
                  </h5>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      {task.category}
                    </Badge>
                    <Badge 
                      className={`text-xs px-1.5 py-0.5 ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </Badge>
                    {viewType === 'month' && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                        {format(new Date(task.dueDate), "MMM d")}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Completed ({completedTasks.length})
          </h4>
          {completedTasks.map((task) => (
            <div
              key={task.id}
              className="p-3 rounded-lg border bg-primary/5 border-primary/20 opacity-75"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm text-primary/80 mb-1 line-clamp-1 line-through">
                    {task.title}
                  </h5>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5 opacity-60">
                      {task.category}
                    </Badge>
                    {viewType === 'month' && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5 opacity-60">
                        {format(new Date(task.dueDate), "MMM d")}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <PageHeader
          onBack={onBack}
          title="Calendar View"
          className="mb-6"
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Card className="bg-card/95 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-lg border-0 w-full pointer-events-auto"
                />
              </CardContent>
            </Card>
          </div>

          {/* Tasks Section */}
          <div className="space-y-4">
            <Card className="bg-card/95 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <CardTitle className="text-lg font-semibold text-primary">
                    Tasks
                  </CardTitle>
                  <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'day' | 'month')} className="w-auto">
                    <TabsList className="grid w-full grid-cols-2 h-8">
                      <TabsTrigger value="day" className="text-xs px-3 py-1">
                        <Eye className="w-3 h-3 mr-1" />
                        Day
                      </TabsTrigger>
                      <TabsTrigger value="month" className="text-xs px-3 py-1">
                        <CalendarDays className="w-3 h-3 mr-1" />
                        Month
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {viewMode === 'day' 
                      ? format(selectedDate, "MMM d, yyyy")
                      : format(selectedDate, "MMMM yyyy")
                    }
                  </div>
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    {viewMode === 'day' ? tasksForSelectedDate.length : tasksForCurrentMonth.length} tasks
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === 'day' ? (
                  tasksForSelectedDate.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                      <h3 className="font-medium mb-1 text-muted-foreground">No tasks scheduled</h3>
                      <p className="text-sm text-muted-foreground/60">This day is free!</p>
                    </div>
                  ) : (
                    renderTaskList(pendingTasksDay, completedTasksDay, 'day')
                  )
                ) : (
                  tasksForCurrentMonth.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarDays className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                      <h3 className="font-medium mb-1 text-muted-foreground">No tasks this month</h3>
                      <p className="text-sm text-muted-foreground/60">This month is clear!</p>
                    </div>
                  ) : (
                    renderTaskList(pendingTasksMonth, completedTasksMonth, 'month')
                  )
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card/95 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {viewMode === 'day' ? pendingTasksDay.length : pendingTasksMonth.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {viewMode === 'day' ? completedTasksDay.length : completedTasksMonth.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
