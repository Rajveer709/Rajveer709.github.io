import { Task } from './Index';
import { Calendar } from '@/components/ui/calendar';
import { CheckCircle, Clock } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';

interface CalendarPageProps {
  tasks: Task[];
  onBack: () => void;
}

export const CalendarPage = ({ tasks, onBack }: CalendarPageProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const tasksForSelectedDate = tasks.filter(task => 
    isSameDay(new Date(task.dueDate), selectedDate)
  );

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
    <div className="space-y-6">
      <PageHeader onBack={onBack} title="Task Calendar" />

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="bg-background/60 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-primary/20">
          <h2 className="text-lg font-semibold mb-4 text-primary text-center">Select Date</h2>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-lg border border-primary/20 shadow-sm pointer-events-auto bg-transparent"
            />
          </div>
        </div>

        <div className="bg-background/60 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-primary/20">
          <h2 className="text-lg font-semibold mb-4 text-primary">
            Tasks for {format(selectedDate, "MMMM d, yyyy")}
          </h2>
          
          {tasksForSelectedDate.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No tasks scheduled for this date</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasksForSelectedDate.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    task.completed 
                      ? 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800/50' 
                      : 'bg-card border-border hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {task.completed && <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />}
                        <h3 className={`font-medium ${
                          task.completed ? 'text-green-800 dark:text-green-300 line-through' : 'text-foreground'
                        }`}>
                          {task.title}
                        </h3>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 rounded-full">
                          {task.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
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
