import { useState } from 'react';
import { Task } from '../pages/Index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EditTaskFormProps {
  task: Task;
  onEditTask: (updatedTask: Partial<Task>) => void;
}

const categories = [
  'Financial',
  'Health & Wellness',
  'Household',
  'Personal',
  'Legal & Admin'
];

const priorities = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' },
  { value: 'urgent', label: 'Urgent Priority' }
];

const repeatOptions = [
  { value: 'none', label: 'No Repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

const extractRepeat = (desc: string) => {
  const match = desc.match(/Repeats: (\w+)/);
  return match ? match[1] : 'none';
};

export const EditTaskForm = ({ task, onEditTask }: EditTaskFormProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [category, setCategory] = useState(task.category);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>(task.priority);
  const [dueDate, setDueDate] = useState<Date>(new Date(task.dueDate));
  const [repeat, setRepeat] = useState(extractRepeat(task.description));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category || !dueDate) {
      return;
    }

    let desc = description;
    if (repeat !== 'none') {
      desc = `${description}\n\nRepeats: ${repeat}`;
    }

    onEditTask({
      title,
      description: desc,
      category,
      priority,
      dueDate
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-scale-in">
      <div>
        <Input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full"
        />
      </div>

      <div>
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setPriority(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium">Repeat</label>
        <Select value={repeat} onValueChange={setRepeat}>
          <SelectTrigger className="w-full">
            <SelectValue>{repeatOptions.find(r => r.value === repeat)?.label}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {repeatOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(dueDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={(date) => date && setDueDate(date)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={!title || !category}
      >
        Update Task
      </Button>
    </form>
  );
};
