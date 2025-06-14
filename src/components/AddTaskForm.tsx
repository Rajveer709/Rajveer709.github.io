
import { useState } from 'react';
import { Task } from '../pages/Index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

const taskTemplates = {
  'Financial': [
    'Paying utility bills (electricity, water, gas)',
    'Paying rent or mortgage',
    'Credit card payments',
    'Loan repayments (personal, auto, education)',
    'Insurance premiums (health, auto, home, life)',
    'Tax filing deadlines and payments',
    'Budgeting and expense tracking',
    'Investment monitoring (stocks, mutual funds, retirement accounts)',
    'Subscription renewals (streaming, apps, memberships)'
  ],
  'Health & Wellness': [
    'Doctor appointments (general, specialist)',
    'Dental check-ups',
    'Medication schedules and refills',
    'Vaccinations',
    'Eye exams',
    'Fitness and workout tracking',
    'Mental health sessions or therapy appointments'
  ],
  'Household': [
    'Home maintenance tasks (cleaning, repairs, inspections)',
    'Appliance servicing or warranties',
    'Vehicle maintenance (oil changes, inspections, registration renewal)',
    'Grocery shopping and meal planning',
    'Trash and recycling collection schedules'
  ],
  'Work & Professional': [
    'Meetings and deadlines',
    'Project milestones',
    'Continuing education or certifications',
    'Job applications and interviews',
    'Tax deductions documentation'
  ],
  'Personal': [
    'Important birthdays and anniversaries',
    'Social events and gatherings',
    'Travel planning and bookings (tickets, hotels)',
    'Learning goals or courses',
    'Reading lists and progress'
  ],
  'Legal & Admin': [
    'Document renewals (passport, driver\'s license, ID cards)',
    'Form submissions (applications, claims, permits)',
    'Voting registration and election dates',
    'Will or estate planning updates'
  ],
  'Digital Life': [
    'Password updates',
    'Backup schedules (photos, documents)',
    'Device updates and upgrades',
    'Email inbox management (important follow-ups)'
  ],
  'Miscellaneous': [
    'Donations or charity commitments',
    'Pet care appointments (vet visits, grooming)',
    'Childcare-related tasks (school events, doctor visits)',
    'Home deliveries and parcel tracking'
  ]
};

const categories = [
  'Financial',
  'Health & Wellness',
  'Household',
  'Personal',
  'Legal & Admin',
  'Work & Professional',
  'Digital Life',
  'Miscellaneous'
];

const priorities = [
  { value: 'low', label: 'Low Priority', color: 'text-green-600' },
  { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
  { value: 'high', label: 'High Priority', color: 'text-orange-600' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
];

export const AddTaskForm = ({ onAddTask }: AddTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [dueDate, setDueDate] = useState<Date>();
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category || !dueDate) {
      return;
    }

    onAddTask({
      title,
      description,
      category,
      priority,
      dueDate,
      completed: false
    });

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setPriority('medium');
    setDueDate(undefined);
    setShowTemplates(false);
  };

  const handleTemplateSelect = (template: string, templateCategory: string) => {
    setTitle(template);
    setCategory(templateCategory);
    setShowTemplates(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
        <h3 className="text-lg font-semibold text-white">Add New Task</h3>
        <p className="text-blue-100 text-sm">Fill in the details for your new task</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Task Title</label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTemplates(!showTemplates)}
              className="shrink-0 border-gray-200 hover:bg-gray-50"
            >
              Templates <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          {showTemplates && (
            <div className="mt-3 max-h-80 overflow-y-auto border border-gray-200 rounded-xl bg-gray-50/50">
              <div className="p-4 space-y-4">
                {Object.entries(taskTemplates).map(([cat, templates]) => (
                  <div key={cat} className="space-y-2">
                    <h4 className="font-semibold text-sm text-blue-600 border-b border-blue-200 pb-1">
                      {cat}
                    </h4>
                    <div className="grid gap-1">
                      {templates.map((template, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleTemplateSelect(template, cat)}
                          className="w-full text-left text-sm p-3 bg-white hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          {template}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description (optional)</label>
          <Textarea
            placeholder="Add any additional details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Priority</label>
            <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setPriority(value)}>
              <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <span className={p.color}>{p.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Due Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-gray-200 focus:border-blue-500 focus:ring-blue-500",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Select due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={!title || !category || !dueDate}
        >
          Add Task
        </Button>
      </form>
    </div>
  );
};
