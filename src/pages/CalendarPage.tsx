
import { Task, Profile } from './Index';
import { Calendar } from '@/components/ui/calendar';
import { CheckCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useOutletContext } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

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

  const tasksForSelectedDate = tasks.filter(task => 
    isSameDay(new Date(task.dueDate), selectedDate)
  );

  // Get task count for each day of the current month
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(new Date(task.dueDate), date));
  };

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800/50';
      case 'high': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800/50';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800/50';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800/50';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800/50';
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        onBack={onBack}
        title="Task Calendar"
      />

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="bg-card/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-border">
          <h2 className="text-lg font-semibold mb-4 text-primary text-center">Calendar View</h2>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-lg border-0 shadow-sm pointer-events-auto bg-transparent"
              modifiers={{
                hasTask: monthDays.filter(day => getTasksForDate(day).length > 0)
              }}
              modifiersStyles={{
                hasTask: { 
                  backgroundColor: 'hsl(var(--primary))', 
                  color: 'hsl(var(--primary-foreground))',
                  fontWeight: 'bold'
                }
              }}
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Dates with tasks are highlighted
            </p>
          </div>
        </div>

        <div className="bg-card/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">
              {format(selectedDate, "MMMM d, yyyy")}
            </h2>
            <Badge variant="secondary" className="text-xs">
              {tasksForSelectedDate.length} {tasksForSelectedDate.length === 1 ? 'task' : 'tasks'}
            </Badge>
          </div>
          
          {tasksForSelectedDate.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <h3 className="font-medium mb-2">No tasks scheduled</h3>
              <p className="text-sm">This day is free of scheduled tasks</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tasksForSelectedDate.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all duration-200 animate-scale-in ${
                    task.completed 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-card border-border hover:shadow-md hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium mb-1 ${
                        task.completed ? 'text-primary/80 line-through' : 'text-foreground'
                      }`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {task.category}
                        </Badge>
                        <Badge 
                          variant={task.priority === 'urgent' ? 'destructive' : 'secondary'} 
                          className="text-xs"
                        >
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
