import { useState } from 'react';
import { Task } from './Index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { themes, defaultTheme } from '../config/themes';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTheme } from 'next-themes';

interface AddTaskPageProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onBack: () => void;
  currentTheme: string;
}

const taskCategories = {
  'Financial Tasks': {
    'Utility bills': ['Electricity', 'Water', 'Gas'],
    'Insurance': ['Health', 'Auto', 'Home', 'Life Premiums'],
    'Credit Card': ['Payments', 'Installments'],
    'Loans': ['Payments', 'Installments'],
    'Taxes': ['Payments', 'Filing Deadlines'],
    'Investment Oversight': ['Stocks', 'Funds', 'Retirement accounts'],
    'Subscriptions': ['Streaming apps', 'Memberships']
  },
  'Health & Wellness': {
    'Medical check-ups': ['General practitioners', 'Specialists'],
    'Dentist visits': ['Check-Ups', 'Cleanings'],
    'Medications': ['Dosages', 'Refill Reminders'],
    'Vaccinations': ['Vaccinations'],
    'Eye exams': ['Eye exams'],
    'Fitness': ['Workouts', 'Exercise Goals'],
    'Mental health': ['Therapy', 'Meditation', 'Self-care']
  },
  'Home Management': {
    'Household chores': ['Cleaning', 'Repairs', 'Inspections'],
    'Appliance upkeep': ['Maintenance', 'Warranty reminders'],
    'Vehicle care': ['Servicing', 'Oil changes & Top-up', 'Registration', 'Tire change'],
    'Groceries & meal planning': ['Groceries & meal planning'],
    'Waste schedule': ['Trash', 'Recycling']
  },
  'Work & Professional': {
    'Meetings & Deadlines': ['Meetings & Deadlines'],
    'Project Milestones': ['Project Milestones'],
    'Certifications & courses': ['Certifications & courses'],
    'Job Search Tasks': ['Applications', 'Interviews'],
    'Work-Related Expenses': ['Documentation']
  },
  'Personal & Social': {
    'Celebrations': ['Birthdays', 'Anniversaries'],
    'Social Planning': ['Events', 'Meetups'],
    'Travel Logistics': ['Tickets', 'Accommodation', 'Itineraries'],
    'Learning': ['Courses', 'Workshops', 'Learning Goals'],
    'Reading': ['Reading list']
  },
  'Legal Things': {
    'Document Renewals': ['Passport', 'License', 'IDs'],
    'Form Submissions': ['Permits', 'Claims', 'Applications'],
    'Civic Tasks': ['Voter Registration', 'Election Reminders'],
    'Estate Management': ['Will Updates', 'Estate Planning']
  },
  'Digital Life': {
    'Passwords': ['Regular Updates'],
    'Backups': ['Photos', 'Docs', 'Cloud Backups'],
    'Software/Device Updates': ['Software/Device Updates'],
    'Inbox upkeep': ['Key follow-ups', 'Zero-Inbox Efforts']
  },
  'Miscellaneous': {
    'Charitable giving': ['Donation Reminders'],
    'Pet Care': ['Vet Visits', 'Grooming'],
    'Child-Related activities': ['School', 'Appointments'],
    'Deliveries': ['Parcel Tracking', 'Home Deliveries']
  }
} as const;

type TaskCategoriesType = typeof taskCategories;
type CategoryKey = keyof TaskCategoriesType;
type SubCategoryKey<T extends CategoryKey> = keyof TaskCategoriesType[T];

const vehicleFluidOptions = [
  'Engine Oil',
  'Coolant',
  'Brake Fluid',
  'Transmission Fluid',
  'Power Steering Fluid',
  'Windshield Washer Fluid',
  'Differential Fluid (Rear/Front Axle Lubricant)'
];

const priorities = [
  { value: 'low', label: 'Low Priority', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-500' },
  { value: 'high', label: 'High Priority', color: 'bg-orange-500' },
  { value: 'urgent', label: 'Urgent Priority', color: 'bg-red-500', emoji: '🚨' }
];

const getThemeBackgroundStyle = (currentTheme: string, resolvedTheme: string | undefined) => {
    const theme = themes.find(t => t.value === currentTheme) || themes.find(t => t.value === defaultTheme);
    if (!theme) return {};
    
    const primaryColor = theme.colors.primary;
    const r = parseInt(primaryColor.slice(1, 3), 16);
    const g = parseInt(primaryColor.slice(3, 5), 16);
    const b = parseInt(primaryColor.slice(5, 7), 16);
    
    const isDark = resolvedTheme === 'dark';
    const startColorOpacity = isDark ? 0.2 : 0.1;
    const endColor = isDark ? 'hsl(222.2, 84%, 4.9%)' : 'white';

    return {
        background: `linear-gradient(to bottom, rgba(${r}, ${g}, ${b}, ${startColorOpacity}), ${endColor})`
    };
};

export const AddTaskPage = ({ onAddTask, onBack, currentTheme }: AddTaskPageProps) => {
  const { resolvedTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [showStreamingDialog, setShowStreamingDialog] = useState(false);
  const [showMedicationDialog, setShowMedicationDialog] = useState(false);
  const [showVehicleDialog, setShowVehicleDialog] = useState(false);
  const [streamingApp, setStreamingApp] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [selectedFluid, setSelectedFluid] = useState('');

  const selectedPriorityDetails = priorities.find(p => p.value === priority);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory('');
    setSelectedTask('');
    setTitle('');
  };

  const handleSubCategorySelect = (subCategory: string) => {
    setSelectedSubCategory(subCategory);
    setSelectedTask('');
    setTitle('');
  };

  const handleTaskSelect = (task: string) => {
    setSelectedTask(task);
    
    // Handle special cases
    if (task === 'Streaming apps') {
      setShowStreamingDialog(true);
      return;
    }
    if (task === 'Refill Reminders') {
      setShowMedicationDialog(true);
      return;
    }
    if (task === 'Oil changes & Top-up') {
      setShowVehicleDialog(true);
      return;
    }
    
    // Set title based on selection
    setTitle(`${selectedSubCategory}: ${task}`);
  };

  const handleStreamingSubmit = () => {
    if (streamingApp) {
      setTitle(`${streamingApp} subscription renewal`);
      setDescription(`Renewal reminder for ${streamingApp} subscription`);
      setShowStreamingDialog(false);
    }
  };

  const handleMedicationSubmit = () => {
    if (medicineName) {
      setTitle(`${medicineName} refill reminder`);
      setDescription(`Reminder to refill ${medicineName} medication`);
      setShowMedicationDialog(false);
    }
  };

  const handleVehicleSubmit = () => {
    if (selectedFluid) {
      setTitle(`${selectedFluid} top-up`);
      setDescription(`Vehicle maintenance: ${selectedFluid} top-up reminder`);
      setShowVehicleDialog(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !selectedCategory || !dueDate) {
      return;
    }

    onAddTask({
      title,
      description,
      category: selectedCategory,
      priority,
      dueDate,
      completed: false
    });

    onBack();
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-foreground/80 hover:text-foreground mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Quick Tasks</h1>
        </div>

        <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Categories Selection */}
            <div>
              <h2 className="text-xl font-semibold text-primary mb-4">Select Task Template</h2>
              <Accordion type="single" collapsible className="w-full" value={selectedCategory} onValueChange={handleCategorySelect}>
                {Object.keys(taskCategories).map((category) => (
                  <AccordionItem value={category} key={category} className="border rounded-lg mb-2 overflow-hidden bg-card/95 shadow-sm last:mb-0">
                    <AccordionTrigger className="hover:no-underline px-4 text-base">{category}</AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-4">
                        <Accordion type="single" collapsible className="w-full" value={selectedSubCategory} onValueChange={handleSubCategorySelect}>
                          {Object.keys(taskCategories[category as CategoryKey]).map((subCategory) => (
                            <AccordionItem value={subCategory} key={subCategory} className="border border-muted rounded-md mb-1 last:mb-0">
                              <AccordionTrigger className="text-sm hover:no-underline px-4">{subCategory}</AccordionTrigger>
                              <AccordionContent>
                                <div className="pl-4 space-y-2">
                                  {(taskCategories[category as CategoryKey][subCategory as SubCategoryKey<CategoryKey>] as readonly string[]).map((task) => (
                                    <Button
                                      key={task}
                                      variant={selectedTask === task ? "default" : "secondary"}
                                      className="w-full justify-start text-left text-sm font-normal h-auto py-2"
                                      onClick={() => handleTaskSelect(task)}
                                    >
                                      {task}
                                    </Button>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Task Form */}
            <div>
              <h2 className="text-xl font-semibold text-primary mb-6">Task Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setPriority(value)}>
                    <SelectTrigger>
                      {selectedPriorityDetails && (
                        <div className="flex items-center gap-2">
                          <span className={cn("h-2.5 w-2.5 rounded-full", selectedPriorityDetails.color)} />
                          <span>{selectedPriorityDetails.label}</span>
                          {selectedPriorityDetails.emoji && <span>{selectedPriorityDetails.emoji}</span>}
                        </div>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          <div className="flex items-center gap-2">
                            <span className={cn("h-2.5 w-2.5 rounded-full", p.color)} />
                            <span>{p.label}</span>
                            {p.emoji && <span className="ml-auto">{p.emoji}</span>}
                          </div>
                        </SelectItem>
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
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!title || !selectedCategory}
                >
                  Add Task
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Streaming App Dialog */}
        <Dialog open={showStreamingDialog} onOpenChange={setShowStreamingDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Enter App Name</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter the app name"
                value={streamingApp}
                onChange={(e) => setStreamingApp(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleStreamingSubmit} className="flex-1">
                  Add Task
                </Button>
                <Button variant="outline" onClick={() => setShowStreamingDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Medication Dialog */}
        <Dialog open={showMedicationDialog} onOpenChange={setShowMedicationDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Enter Medicine Name</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter the name of your medicine"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleMedicationSubmit} className="flex-1">
                  Add Task
                </Button>
                <Button variant="outline" onClick={() => setShowMedicationDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Vehicle Fluid Dialog */}
        <Dialog open={showVehicleDialog} onOpenChange={setShowVehicleDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Choose Top-up Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={selectedFluid} onValueChange={setSelectedFluid}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fluid type" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleFluidOptions.map((fluid) => (
                    <SelectItem key={fluid} value={fluid}>
                      {fluid}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button onClick={handleVehicleSubmit} className="flex-1" disabled={!selectedFluid}>
                  Add Task
                </Button>
                <Button variant="outline" onClick={() => setShowVehicleDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
