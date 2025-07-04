import { useState } from 'react';
import { Task } from './Index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, ChevronRight, DollarSign, Heart, Home, Briefcase, Gavel, Monitor, Gift, Car, Repeat, Plus, ChevronDown } from 'lucide-react';
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
import { toast } from 'sonner';

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
  const [isQuickTasksOpen, setIsQuickTasksOpen] = useState(true);
  const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());

  const selectedPriorityDetails = priorities.find(p => p.value === priority);

  const handleCategorySelect = (category: string) => {
    // If clicking the same category, close it
    if (selectedCategory === category) {
      setSelectedCategory('');
    } else {
      setSelectedCategory(category);
    }
    // Reset other selections when changing category
    setSelectedSubCategory('');
    setSelectedTask('');
    setTitle('');
    setExpandedSubCategories(new Set());
  };

  const handleSubCategoryToggle = (subCategory: string) => {
    const newExpanded = new Set(expandedSubCategories);
    if (newExpanded.has(subCategory)) {
      newExpanded.delete(subCategory);
    } else {
      newExpanded.add(subCategory);
    }
    setExpandedSubCategories(newExpanded);
    
    // Set selected subcategory for form purposes
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

    // Show success toast in bottom right
    toast.success("Task Added Successfully! ✅", {
      description: `"${title}" has been added to your tasks.`,
      position: "bottom-right",
    });

    // Navigate back immediately without delay
    onBack();
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <PageHeader title="Add Task" onBack={onBack} className="mb-6" />

        <div className="space-y-6">
          {/* Quick Tasks Section - Fixed animations and visibility */}
          <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <Collapsible
              open={isQuickTasksOpen}
              onOpenChange={setIsQuickTasksOpen}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between hover:bg-muted/20 rounded-lg p-3 transition-all duration-200 group">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-full bg-primary/15">
                    <Plus className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-primary">Quick Tasks</CardTitle>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 transform transition-transform duration-200 ease-out",
                  isQuickTasksOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'
                )} />
              </CollapsibleTrigger>
              
              <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                <div className="px-3 pb-3">
                  <div className="space-y-3">
                    {Object.keys(taskCategories).map((category) => {
                      const CategoryIcon = taskCategories[category as CategoryKey].icon;
                      const isExpanded = selectedCategory === category;
                      
                      return (
                        <div 
                          key={category}
                          className="border border-border/40 rounded-lg overflow-hidden bg-card/30 shadow-sm hover:shadow-md transition-all duration-200 hover:border-border/80"
                        >
                          {/* Category Header */}
                          <button
                            onClick={() => handleCategorySelect(category)}
                            className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-muted/10 transition-all duration-200 group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                                <CategoryIcon className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium">{category}</span>
                            </div>
                            <ChevronDown className={cn(
                              "h-4 w-4 transition-transform duration-200 ease-out",
                              isExpanded ? 'rotate-180 text-primary' : 'text-muted-foreground'
                            )} />
                          </button>

                          {/* Category Content */}
                          <div className={cn(
                            "overflow-hidden transition-all duration-300 ease-out",
                            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          )}>
                            <div className="px-3 pb-2.5 pt-1 space-y-2">
                              {Object.keys(taskCategories[category as CategoryKey]).filter(key => key !== 'icon').map((subCategory) => {
                                const subCategoryTasks = taskCategories[category as CategoryKey][subCategory as keyof Omit<TaskCategoriesType[CategoryKey], 'icon'>] as string[];
                                const isSubExpanded = expandedSubCategories.has(subCategory);
                                
                                return (
                                  <div key={subCategory} className="space-y-1">
                                    {/* Subcategory Button */}
                                    <button
                                      onClick={() => handleSubCategoryToggle(subCategory)}
                                      className="w-full flex items-center justify-between text-left text-sm font-normal py-2 px-2.5 hover:bg-muted/30 transition-all duration-200 hover:scale-[1.01] group rounded-md"
                                    >
                                      <span>{subCategory}</span>
                                      <ChevronDown className={cn(
                                        "h-3.5 w-3.5 transition-transform duration-200 ease-out",
                                        isSubExpanded ? 'rotate-180 text-primary' : 'text-muted-foreground',
                                        "opacity-50 group-hover:opacity-100"
                                      )} />
                                    </button>
                                    
                                    {/* Subcategory Tasks */}
                                    <div className={cn(
                                      "ml-3 overflow-hidden transition-all duration-300 ease-out",
                                      isSubExpanded ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                                    )}>
                                      <div className="space-y-1 py-1">
                                        {subCategoryTasks && subCategoryTasks.map((task) => (
                                          <button
                                            key={task}
                                            onClick={() => handleTaskSelect(task)}
                                            className={cn(
                                              "w-full text-left text-xs py-1.5 px-2.5 rounded-md transition-all duration-200 hover:scale-[1.01]",
                                              selectedTask === task 
                                                ? "bg-primary/20 text-primary border border-primary/30" 
                                                : "hover:bg-muted/40 text-foreground"
                                            )}
                                          >
                                            {task}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Task Form - Compact mobile layout */}
          <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-primary">Task Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Task Title</label>
                  <Input
                    placeholder="Enter task title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border-input bg-background h-10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description (optional)</label>
                  <Textarea
                    placeholder="Add task description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="border-input resize-none bg-background"
                  />
                </div>

                {/* Compact grid layout for mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Priority</label>
                    <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setPriority(value)}>
                      <SelectTrigger className="border-input bg-background h-10">
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
                      <SelectTrigger className="border-input bg-background h-10">
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
                          "w-full justify-start text-left font-normal border-input bg-background h-10"
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
                  className="w-full h-11 text-base font-medium bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  disabled={!title || !selectedCategory}
                >
                  Add Task
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