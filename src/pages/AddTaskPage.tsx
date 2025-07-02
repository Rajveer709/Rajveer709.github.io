
import { useState } from 'react';
import { Task } from './Index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, ChevronRight, DollarSign, Heart, Home, Briefcase, Gavel, Monitor, Gift, Car, Repeat, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
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
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AddTaskPageProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onBack: () => void;
  currentTheme: string;
  profile: { name: string | null } | null;
}

const taskCategories = {
  'Financial Tasks': {
    icon: DollarSign,
    'Utility bills': ['Electricity', 'Water', 'Gas'],
    'Insurance': ['Health', 'Auto', 'Home', 'Life Premiums'],
    'Credit Card': ['Payments', 'Installments'],
    'Loans': ['Payments', 'Installments'],
    'Taxes': ['Payments', 'Filing Deadlines'],
    'Investment Oversight': ['Stocks', 'Funds', 'Retirement accounts'],
    'Subscriptions': ['Streaming apps', 'Memberships']
  },
  'Health & Wellness': {
    icon: Heart,
    'Medical check-ups': ['General practitioners', 'Specialists'],
    'Dentist visits': ['Check-Ups', 'Cleanings'],
    'Medications': ['Dosages', 'Refill Reminders'],
    'Vaccinations': ['Vaccinations'],
    'Eye exams': ['Eye exams'],
    'Fitness': ['Workouts', 'Exercise Goals'],
    'Mental health': ['Therapy', 'Meditation', 'Self-care']
  },
  'Home Management': {
    icon: Home,
    'Household chores': ['Cleaning', 'Repairs', 'Inspections'],
    'Appliance upkeep': ['Maintenance', 'Warranty reminders'],
    'Vehicle care': ['Servicing', 'Oil changes & Top-up', 'Registration', 'Tire change'],
    'Groceries & meal planning': ['Groceries & meal planning'],
    'Waste schedule': ['Trash', 'Recycling']
  },
  'Work & Professional': {
    icon: Briefcase,
    'Meetings & Deadlines': ['Meetings & Deadlines'],
    'Project Milestones': ['Project Milestones'],
    'Certifications & courses': ['Certifications & courses'],
    'Job Search Tasks': ['Applications', 'Interviews'],
    'Work-Related Expenses': ['Documentation']
  },
  'Personal & Social': {
    icon: Gift,
    'Celebrations': ['Birthdays', 'Anniversaries'],
    'Social Planning': ['Events', 'Meetups'],
    'Travel Logistics': ['Tickets', 'Accommodation', 'Itineraries'],
    'Learning': ['Courses', 'Workshops', 'Learning Goals'],
    'Reading': ['Reading list']
  },
  'Legal Things': {
    icon: Gavel,
    'Document Renewals': ['Passport', 'License', 'IDs'],
    'Form Submissions': ['Permits', 'Claims', 'Applications'],
    'Civic Tasks': ['Voter Registration', 'Election Reminders'],
    'Estate Management': ['Will Updates', 'Estate Planning']
  },
  'Digital Life': {
    icon: Monitor,
    'Passwords': ['Regular Updates'],
    'Backups': ['Photos', 'Docs', 'Cloud Backups'],
    'Software/Device Updates': ['Software/Device Updates'],
    'Inbox upkeep': ['Key follow-ups', 'Zero-Inbox Efforts']
  },
  'Miscellaneous': {
    icon: Car,
    'Charitable giving': ['Donation Reminders'],
    'Pet Care': ['Vet Visits', 'Grooming'],
    'Child-Related activities': ['School', 'Appointments'],
    'Deliveries': ['Parcel Tracking', 'Home Deliveries']
  },
  'Hidden Hacking Features': {
    icon: Gift,
    'Secret Stuff': ['Click for a surprise 🎉']
  }
} as const;

type TaskCategoriesType = typeof taskCategories;
type CategoryKey = keyof TaskCategoriesType;
type SubCategoryKey<T extends CategoryKey> = keyof Omit<TaskCategoriesType[T], 'icon'>;

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

const repeatOptions = [
  { value: 'none', label: 'No Repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

export const AddTaskPage = ({ onAddTask, onBack, currentTheme, profile }: AddTaskPageProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [repeatFrequency, setRepeatFrequency] = useState<string>('none');
  const [showStreamingDialog, setShowStreamingDialog] = useState(false);
  const [showMedicationDialog, setShowMedicationDialog] = useState(false);
  const [showVehicleDialog, setShowVehicleDialog] = useState(false);
  const [showRickRollDialog, setShowRickRollDialog] = useState(false);
  const [streamingApp, setStreamingApp] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [selectedFluid, setSelectedFluid] = useState('');
  const [isQuickTasksOpen, setIsQuickTasksOpen] = useState(false);

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
      description: repeatFrequency !== 'none' ? `${description}\n\nRepeats: ${repeatFrequency}` : description,
      category: selectedCategory,
      priority,
      dueDate,
      completed: false
    });

    onBack();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <PageHeader title="Create Task" onBack={onBack} className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Tasks Section */}
          <Card className="h-fit">
            <CardHeader className="pb-4">
              <Collapsible
                open={isQuickTasksOpen}
                onOpenChange={setIsQuickTasksOpen}
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Quick Tasks
                  </CardTitle>
                  <ChevronRight className={`h-5 w-5 transform transition-transform duration-300 ${isQuickTasksOpen ? 'rotate-90' : ''}`} />
                </CollapsibleTrigger>
              </Collapsible>
            </CardHeader>
            <CardContent>
              <Collapsible
                open={isQuickTasksOpen}
                onOpenChange={setIsQuickTasksOpen}
              >
                <CollapsibleContent>
                  <Accordion type="single" collapsible className="w-full" value={selectedCategory} onValueChange={handleCategorySelect}>
                    {Object.keys(taskCategories).map((category) => {
                      const CategoryIcon = taskCategories[category as CategoryKey].icon;
                      return (
                        <AccordionItem 
                          value={category} 
                          key={category} 
                          className="border rounded-lg mb-3 overflow-hidden bg-card shadow-sm last:mb-0"
                        >
                          <AccordionTrigger className="hover:no-underline px-4 py-3 text-base">
                            <div className="flex items-center gap-3">
                              <CategoryIcon className="h-5 w-5 text-primary" />
                              <span>{category}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="px-4 pb-2">
                              <Accordion type="single" collapsible className="w-full" value={selectedSubCategory} onValueChange={handleSubCategorySelect}>
                                {Object.keys(taskCategories[category as CategoryKey]).filter(key => key !== 'icon').map((subCategory) => (
                                  <AccordionItem 
                                    value={subCategory} 
                                    key={subCategory} 
                                    className="border border-border/50 rounded-md mb-2 bg-muted/30 last:mb-0"
                                  >
                                    <AccordionTrigger className="text-sm hover:no-underline px-3 py-2">
                                      {subCategory}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div className="px-3 pb-2 space-y-2">
                                        {(taskCategories[category as CategoryKey][subCategory as SubCategoryKey<CategoryKey>] as readonly string[]).map((task) => (
                                          <Button
                                            key={task}
                                            variant={selectedTask === task ? "default" : "outline"}
                                            className="w-full justify-start text-left text-sm font-normal h-auto py-2 px-3"
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
                      );
                    })}
                  </Accordion>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          {/* Task Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary">Task Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Task Title</label>
                  <Input
                    placeholder="Enter task title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border-input"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description (optional)</label>
                  <Textarea
                    placeholder="Add task description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="border-input resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Priority</label>
                    <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setPriority(value)}>
                      <SelectTrigger className="border-input">
                        <SelectValue>
                          {selectedPriorityDetails && (
                            <div className="flex items-center gap-2">
                              <span className={cn("h-2.5 w-2.5 rounded-full", selectedPriorityDetails.color)} />
                              <span>{selectedPriorityDetails.label}</span>
                              {selectedPriorityDetails.emoji && <span>{selectedPriorityDetails.emoji}</span>}
                            </div>
                          )}
                        </SelectValue>
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Repeat</label>
                    <Select value={repeatFrequency} onValueChange={setRepeatFrequency}>
                      <SelectTrigger className="border-input">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <Repeat className="h-4 w-4" />
                            <span>{repeatOptions.find(r => r.value === repeatFrequency)?.label}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {repeatOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Repeat className="h-4 w-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Due Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-input"
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
                  className="w-full h-12 text-base font-medium"
                  disabled={!title || !selectedCategory}
                >
                  Create Task
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Dialogs */}
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

        <Dialog open={showRickRollDialog} onOpenChange={setShowRickRollDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>A surprise for you!</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-center">
              <img src="/lovable-uploads/0b3245b2-4eeb-423d-8ab4-93b3c1d6efc8.png" alt="Rick Astley" className="rounded-lg" />
              <p className="text-lg font-semibold">
                You have been RickRolled{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}!
              </p>
              <Button onClick={() => {
                setShowRickRollDialog(false);
                setSelectedCategory('');
                setSelectedSubCategory('');
                setSelectedTask('');
              }}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
