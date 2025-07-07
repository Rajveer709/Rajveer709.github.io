import { Task, Profile } from './Index';
import { Calendar } from '@/components/ui/calendar';
import { CheckCircle, Clock, Calendar as CalendarIcon, Eye, CalendarDays, Filter } from 'lucide-react';
import { format, isSameDay, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { isWithinInterval } from 'date-fns/isWithinInterval';
import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useOutletContext } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
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
  desktopView?: boolean;
}

export const CalendarPage = ({ tasks, onBack }: CalendarPageProps) => {
  const { desktopView } = useOutletContext<OutletContextType & { desktopView?: boolean }>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  const tasksForSelectedDate = tasks.filter(task => 
    isSameDay(new Date(task.dueDate), selectedDate)
  );

  const tasksForCurrentMonth = tasks.filter(task => 
    isSameMonth(new Date(task.dueDate), selectedDate)
  );

  // Week logic
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const tasksForCurrentWeek = tasks.filter(task =>
    isWithinInterval(new Date(task.dueDate), { start: weekStart, end: weekEnd })
  );

  const completedTasksDay = tasksForSelectedDate.filter(task => task.completed);
  const pendingTasksDay = tasksForSelectedDate.filter(task => !task.completed);

  const completedTasksMonth = tasksForCurrentMonth.filter(task => task.completed);
  const pendingTasksMonth = tasksForCurrentMonth.filter(task => !task.completed);

  const completedTasksWeek = tasksForCurrentWeek.filter(task => task.completed);
  const pendingTasksWeek = tasksForCurrentWeek.filter(task => !task.completed);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  const renderTaskList = (pendingTasks: Task[], completedTasks: Task[], viewType: 'day' | 'week' | 'month') => (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Pending ({pendingTasks.length})
            </h4>
          </div>
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              className="p-2 rounded-lg border bg-card border-border hover:border-primary/30 transition-all duration-200 group"
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <div className="w-3 h-3 rounded-full border-2 border-muted-foreground/40 group-hover:border-primary/60 transition-colors"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-xs text-foreground mb-1 line-clamp-1">
                    {task.title}
                  </h5>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 flex-wrap">
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {task.category}
                    </Badge>
                    <Badge 
                      className={`text-xs px-1 py-0 ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </Badge>
                    {viewType === 'month' && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
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
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 text-primary" />
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Completed ({completedTasks.length})
            </h4>
          </div>
          {completedTasks.map((task) => (
            <div
              key={task.id}
              className="p-2 rounded-lg border bg-primary/5 border-primary/20 opacity-75"
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <CheckCircle className="w-3 h-3 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-xs text-primary/80 mb-1 line-clamp-1 line-through">
                    {task.title}
                  </h5>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs px-1 py-0 opacity-60">
                      {task.category}
                    </Badge>
                    {viewType === 'month' && (
                      <Badge variant="secondary" className="text-xs px-1 py-0 opacity-60">
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

      {/* Empty State */}
      {pendingTasks.length === 0 && completedTasks.length === 0 && (
        <div className="text-center py-6">
          <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
          <h3 className="font-medium mb-1 text-muted-foreground text-sm">No tasks</h3>
          <p className="text-xs text-muted-foreground/60">
            {viewType === 'day' ? 'This day is free!' : viewType === 'week' ? 'This week is free!' : 'This month is clear!'}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className={desktopView ? "min-h-screen bg-background" : "min-h-screen bg-background"}>
      <div className={desktopView ? "mx-auto py-8 max-w-7xl px-8" : "container mx-auto px-4 py-4 max-w-6xl"}>
        {/* Header - removed profile photo */}
        <div className={desktopView ? "flex flex-col items-start mb-8" : "flex flex-col items-start mb-4"}>
          <PageHeader
            onBack={onBack}
            title="Calendar"
            className="mb-0"
          />
        </div>
        
        {/* Main content - centered layout */}
        <div className="flex flex-col items-center w-full max-w-5xl mx-auto overflow-y-auto" style={{ maxHeight: 'calc(100vh - 56px)' }}>
          <div className="grid lg:grid-cols-3 gap-6 w-full">
            {/* Calendar Section - always centered */}
            <div className="lg:col-span-2 flex flex-col justify-center items-center">
              <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-sm w-full max-w-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-primary flex items-center gap-2 justify-center">
                    <CalendarIcon className="w-4 h-4" />
                    Calendar View
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-lg border-0 w-full pointer-events-auto"
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Tasks Section - centered */}
            <div className="space-y-4 flex flex-col items-center w-full">
              {/* Tasks Card */}
              <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-sm w-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-base font-semibold text-primary">
                      Tasks
                    </CardTitle>
                    <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'day' | 'week' | 'month')} className="w-auto">
                      <TabsList className="grid w-full grid-cols-3 h-7">
                        <TabsTrigger value="day" className="text-xs px-2 py-1">
                          <Eye className="w-3 h-3 mr-1" />
                          Day
                        </TabsTrigger>
                        <TabsTrigger value="week" className="text-xs px-2 py-1">
                          <CalendarDays className="w-3 h-3 mr-1" />
                          Week
                        </TabsTrigger>
                        <TabsTrigger value="month" className="text-xs px-2 py-1">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          Month
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {viewMode === 'day' && format(selectedDate, "MMM d, yyyy")}
                      {viewMode === 'week' && `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`}
                      {viewMode === 'month' && format(selectedDate, "MMMM yyyy")}
                    </div>
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      {viewMode === 'day' && tasksForSelectedDate.length}
                      {viewMode === 'week' && tasksForCurrentWeek.length}
                      {viewMode === 'month' && tasksForCurrentMonth.length} tasks
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {viewMode === 'day' && renderTaskList(pendingTasksDay, completedTasksDay, 'day')}
                  {viewMode === 'week' && renderTaskList(pendingTasksWeek, completedTasksWeek, 'week')}
                  {viewMode === 'month' && renderTaskList(pendingTasksMonth, completedTasksMonth, 'month')}
                </CardContent>
              </Card>
              
              {/* Quick Stats Card */}
              <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-sm w-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2 justify-center">
                    <Filter className="w-3 h-3" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-primary">
                        {viewMode === 'day' ? pendingTasksDay.length : viewMode === 'week' ? pendingTasksWeek.length : pendingTasksMonth.length}
                      </div>
                      <div className="text-xs text-muted-foreground">Pending</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {viewMode === 'day' ? completedTasksDay.length : viewMode === 'week' ? completedTasksWeek.length : completedTasksMonth.length}
                      </div>
                      <div className="text-xs text-muted-foreground">Done</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};