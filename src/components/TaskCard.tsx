
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
  AlertTriangle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EditTaskForm } from './EditTaskForm';
import { format, isAfter, differenceInDays } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (updatedTask: Partial<Task>) => void;
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

const priorityColors: { [key: string]: string } = {
  'low': 'bg-gray-100 text-gray-700 border-gray-200',
  'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'high': 'bg-red-100 text-red-800 border-red-200'
};

export const TaskCard = ({ task, onToggle, onDelete, onEdit }: TaskCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const Icon = categoryIcons[task.category] || FileText;
  const isOverdue = !task.completed && isAfter(new Date(), new Date(task.dueDate));
  const daysUntilDue = differenceInDays(new Date(task.dueDate), new Date());
  
  const handleEdit = (updatedTask: Partial<Task>) => {
    onEdit(updatedTask);
    setIsEditOpen(false);
  };

  return (
    <Card className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
      task.completed ? 'opacity-60' : ''
    } ${isOverdue ? 'ring-2 ring-red-200' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={onToggle}
              className="mt-1"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-gray-600" />
                <h3 className={`font-semibold text-gray-800 ${task.completed ? 'line-through' : ''}`}>
                  {task.title}
                </h3>
                {isOverdue && !task.completed && (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
              </div>
              
              {task.description && (
                <p className={`text-gray-600 mb-3 ${task.completed ? 'line-through' : ''}`}>
                  {task.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-2">
                <Badge 
                  variant="outline"
                  className={categoryColors[task.category] || 'bg-gray-100 text-gray-800'}
                >
                  {task.category}
                </Badge>
                
                <Badge 
                  variant="outline"
                  className={priorityColors[task.priority]}
                >
                  {task.priority} priority
                </Badge>
                
                <div className={`flex items-center text-sm ${
                  isOverdue && !task.completed ? 'text-red-600 font-medium' : 'text-gray-500'
                }`}>
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  {!task.completed && (
                    <span className="ml-2">
                      {isOverdue 
                        ? `(${Math.abs(daysUntilDue)} days overdue)`
                        : daysUntilDue === 0 
                        ? '(Due today)'
                        : `(${daysUntilDue} days left)`
                      }
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
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
