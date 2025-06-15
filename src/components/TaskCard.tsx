
import { useState } from 'react';
import { Task } from '../pages/Index';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DollarSign, 
  Heart, 
  Home, 
  User, 
  FileText,
  Trash,
  Pencil,
  Calendar as CalendarIcon,
  AlertTriangle,
  EyeOff
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EditTaskForm } from './EditTaskForm';
import { format, isAfter, differenceInDays } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (updatedTask: Partial<Task>) => void;
  onHide: () => void;
}

const CATEGORY_ICONS = {
  'Financial': DollarSign,
  'Health & Wellness': Heart,
  'Household': Home,
  'Personal': User,
  'Legal & Admin': FileText
} as const;

const CATEGORY_COLORS = {
  'Financial': 'bg-green-100 text-green-800 border-green-200',
  'Health & Wellness': 'bg-red-100 text-red-800 border-red-200',
  'Household': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Personal': 'bg-purple-100 text-purple-800 border-purple-200',
  'Legal & Admin': 'bg-blue-100 text-blue-800 border-blue-200'
} as const;

const PRIORITY_COLORS = {
  'low': 'bg-gray-100 text-gray-700 border-gray-200',
  'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'high': 'bg-red-100 text-red-800 border-red-200'
} as const;

export const TaskCard = ({ task, onToggle, onDelete, onEdit, onHide }: TaskCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const Icon = CATEGORY_ICONS[task.category] || FileText;
  const isOverdue = !task.completed && isAfter(new Date(), new Date(task.dueDate));
  const daysUntilDue = differenceInDays(new Date(task.dueDate), new Date());
  
  const handleEdit = (updatedTask: Partial<Task>) => {
    onEdit(updatedTask);
    setIsEditOpen(false);
  };

  const getDateText = () => {
    if (task.completed) return format(new Date(task.dueDate), 'MMM d, yyyy');
    
    if (isOverdue) return `(${Math.abs(daysUntilDue)} days overdue)`;
    if (daysUntilDue === 0) return '(Due today)';
    return `(${daysUntilDue} days left)`;
  };

  return (
    <Card className={`
      bg-card/80 dark:bg-card/30 backdrop-blur-sm border-0 shadow-lg 
      hover:shadow-xl transition-all duration-300 hover:-translate-y-1
      ${task.completed ? 'opacity-60' : ''}
      ${isOverdue ? 'ring-2 ring-destructive/50' : ''}
    `}>
      <CardContent className="p-4 sm:p-6">
        {/* Portrait-optimized layout */}
        <div className="space-y-4">
          {/* Header with checkbox and title */}
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={onToggle}
              className="mt-1 flex-shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <h3 className={`font-semibold text-gray-800 ${task.completed ? 'line-through' : ''} break-words`}>
                  {task.title}
                </h3>
                {isOverdue && !task.completed && (
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                )}
              </div>
              
              {task.description && (
                <p className={`text-gray-600 text-sm mb-3 break-words ${task.completed ? 'line-through' : ''}`}>
                  {task.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Badges and date - Stacked for portrait */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="outline"
                className={`${CATEGORY_COLORS[task.category] || 'bg-gray-100 text-gray-800'} text-xs`}
              >
                {task.category}
              </Badge>
              
              <Badge 
                variant="outline"
                className={`${PRIORITY_COLORS[task.priority]} text-xs`}
              >
                {task.priority} priority
              </Badge>
            </div>
            
            <div className={`flex items-center text-sm ${
              isOverdue && !task.completed ? 'text-red-600 font-medium' : 'text-gray-500'
            }`}>
              <CalendarIcon className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="break-words">
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
                {!task.completed && (
                  <span className="ml-2">{getDateText()}</span>
                )}
              </span>
            </div>
          </div>
          
          {/* Action buttons - Better spacing for portrait */}
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            {task.completed && (
              <Button variant="ghost" size="sm" onClick={onHide} className="text-gray-500 hover:text-blue-600">
                <EyeOff className="w-4 h-4" />
              </Button>
            )}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                  <Pencil className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <EditTaskForm task={task} onEditTask={handleEdit} />
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDelete}
              className="text-gray-500 hover:text-red-600"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
