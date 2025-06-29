
import { useState } from 'react';
import { Task } from './Index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, ChevronRight, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { themes, defaultTheme } from '../config/themes';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useTheme } from 'next-themes';
import { PageHeader } from '@/components/PageHeader';

interface AddTaskPageProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onBack: () => void;
  currentTheme: string;
  profile: { name: string | null } | null;
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
  },
  'Hidden Hacking Features': {
    'Secret Stuff': ['Click for a surprise 🎉']
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

export const AddTaskPage = ({ onAddTask, onBack, currentTheme, profile }: AddTaskPageProps) => {
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
  const [showRickRollDialog, setShowRickRollDialog] = useState(false);
  const [streamingApp, setStreamingApp] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [selectedFluid, setSelectedFluid] = useState('');
  const [isQuickTasksOpen, setIsQuickTasksOpen] = useState(false);

  const selectedPriorityDetails = priorities.find(p => p.value === priority);
  const theme = themes.find(t => t.value === currentTheme) || themes.find(t => t.value === defaultTheme);

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
    if (task === 'Click for a surprise 🎉') {
      setShowRickRollDialog(true);
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

    // Show success toast
    toast.success('Task added successfully!', {
      duration: 1000,
      style: {
        background: theme?.colors.primary,
        color: 'white',
        border: 'none'
      }
    });

    onBack();
  };

  return (
    <div className="font-sans min-h-screen" style={getThemeBackgroundStyle(currentTheme, resolvedTheme)}>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="animate-fade-in opacity-0" style={{ animationDelay: '100ms' }}>
          <PageHeader title="Create Task" onBack={onBack} />
        </div>

        <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 border border-border/30 shadow-xl hover:shadow-2xl transition-all duration-500 animate-scale-in opacity-0" style={{ animationDelay: '200ms' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Tasks Section */}
            <div className="animate-slide-in-from-left opacity-0" style={{ animationDelay: '300ms' }}>
              <Collapsible
                open={isQuickTasksOpen}
                onOpenChange={setIsQuickTasksOpen}
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between text-xl font-semibold text-primary mb-4 hover:text-primary/80 transition-colors duration-300 group">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary group-hover:animate-pulse" />
                    <span>Quick Tasks</span>
                  </div>
                  <ChevronRight className={`h-6 w-6 transform transition-all duration-300 ${isQuickTasksOpen ? 'rotate-90' : ''} group-hover:scale-110`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Accordion type="single" collapsible className="w-full" value={selectedCategory} onValueChange={handleCategorySelect}>
                    {Object.keys(taskCategories).map((category, index) => (
                      <AccordionItem 
                        value={category} 
                        key={category} 
                        className="border rounded-lg mb-2 overflow-hidden bg-card/95 shadow-sm last:mb-0 hover:shadow-md transition-all duration-300 animate-fade-in opacity-0" 
                        style={{ animationDelay: `${400 + index * 50}ms` }}
                      >
                        <AccordionTrigger className="hover:no-underline px-4 text-base hover:bg-muted/30 transition-all duration-300">{category}</AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-4">
                            <Accordion type="single" collapsible className="w-full" value={selectedSubCategory} onValueChange={handleSubCategorySelect}>
                              {Object.keys(taskCategories[category as CategoryKey]).map((subCategory) => (
                                <AccordionItem value={subCategory} key={subCategory} className="border border-muted rounded-md mb-1 last:mb-0 hover:shadow-sm transition-all duration-300">
                                  <AccordionTrigger className="text-sm hover:no-underline px-4 hover:bg-muted/20 transition-all duration-300">{subCategory}</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="pl-4 space-y-2">
                                      {(taskCategories[category as CategoryKey][subCategory as SubCategoryKey<CategoryKey>] as readonly string[]).map((task) => (
                                        <Button
                                          key={task}
                                          variant={selectedTask === task ? "default" : "secondary"}
                                          className="w-full justify-start text-left text-sm font-normal h-auto py-2 transition-all duration-300 hover:scale-105 hover:shadow-md"
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
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Task Form */}
            <div className="animate-slide-in-from-left opacity-0" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-full" style={{ backgroundColor: `${theme?.colors.primary}20` }}>
                  <Sparkles className="h-5 w-5" style={{ color: theme?.colors.primary }} />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Task Details</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Task Title</label>
                  <Input
                    placeholder="Enter your task..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="transition-all duration-300 focus:scale-105 border-border/50 focus:border-primary/50 shadow-sm hover:shadow-md"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <Textarea
                    placeholder="Add details about your task..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="transition-all duration-300 focus:scale-105 border-border/50 focus:border-primary/50 shadow-sm hover:shadow-md resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Priority Level</label>
                  <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setPriority(value)}>
                    <SelectTrigger className="transition-all duration-300 hover:scale-105 border-border/50 focus:border-primary/50 shadow-sm hover:shadow-md">
                      {selectedPriorityDetails && (
                        <div className="flex items-center gap-2">
                          <span className={cn("h-2.5 w-2.5 rounded-full animate-pulse", selectedPriorityDetails.color)} />
                          <span>{selectedPriorityDetails.label}</span>
                          {selectedPriorityDetails.emoji && <span>{selectedPriorityDetails.emoji}</span>}
                        </div>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((p) => (
                        <SelectItem key={p.value} value={p.value} className="hover:bg-muted/50 transition-colors duration-300">
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

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Due Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal transition-all duration-300 hover:scale-105 border-border/50 focus:border-primary/50 shadow-sm hover:shadow-md"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(dueDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 shadow-xl border-border/30" align="start">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={(date) => date && setDueDate(date)}
                        initialFocus
                        className="rounded-lg"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  disabled={!title || !selectedCategory}
                  style={{ backgroundColor: theme?.colors.primary }}
                >
                  <Sparkles className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  Create Task
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Streaming App Dialog */}
        <Dialog open={showStreamingDialog} onOpenChange={setShowStreamingDialog}>
          <DialogContent className="sm:max-w-md border-border/30 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">Enter App Name</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter the app name"
                value={streamingApp}
                onChange={(e) => setStreamingApp(e.target.value)}
                className="transition-all duration-300 focus:scale-105"
              />
              <div className="flex gap-2">
                <Button onClick={handleStreamingSubmit} className="flex-1 transition-all duration-300 hover:scale-105">
                  Add Task
                </Button>
                <Button variant="outline" onClick={() => setShowStreamingDialog(false)} className="transition-all duration-300 hover:scale-105">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Medication Dialog */}
        <Dialog open={showMedicationDialog} onOpenChange={setShowMedicationDialog}>
          <DialogContent className="sm:max-w-md border-border/30 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">Enter Medicine Name</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter the name of your medicine"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                className="transition-all duration-300 focus:scale-105"
              />
              <div className="flex gap-2">
                <Button onClick={handleMedicationSubmit} className="flex-1 transition-all duration-300 hover:scale-105">
                  Add Task
                </Button>
                <Button variant="outline" onClick={() => setShowMedicationDialog(false)} className="transition-all duration-300 hover:scale-105">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Vehicle Fluid Dialog */}
        <Dialog open={showVehicleDialog} onOpenChange={setShowVehicleDialog}>
          <DialogContent className="sm:max-w-md border-border/30 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">Choose Top-up Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={selectedFluid} onValueChange={setSelectedFluid}>
                <SelectTrigger className="transition-all duration-300 hover:scale-105">
                  <SelectValue placeholder="Select fluid type" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleFluidOptions.map((fluid) => (
                    <SelectItem key={fluid} value={fluid} className="hover:bg-muted/50 transition-colors duration-300">
                      {fluid}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button onClick={handleVehicleSubmit} className="flex-1 transition-all duration-300 hover:scale-105" disabled={!selectedFluid}>
                  Add Task
                </Button>
                <Button variant="outline" onClick={() => setShowVehicleDialog(false)} className="transition-all duration-300 hover:scale-105">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* RickRoll Dialog */}
        <Dialog open={showRickRollDialog} onOpenChange={setShowRickRollDialog}>
          <DialogContent className="sm:max-w-md border-border/30 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">A surprise for you!</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-center">
              <img src="/lovable-uploads/0b3245b2-4eeb-423d-8ab4-93b3c1d6efc8.png" alt="Rick Astley" className="rounded-lg shadow-lg animate-pulse" />
              <p className="text-lg font-semibold text-foreground">
                You have been RickRolled{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}!
              </p>
              <Button onClick={() => {
                setShowRickRollDialog(false);
                setSelectedCategory('');
                setSelectedSubCategory('');
                setSelectedTask('');
              }} className="transition-all duration-300 hover:scale-105">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
