
import { useState } from 'react';
import { Task } from './Index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, ChevronRight, Sparkles, Plus, Target } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { themes, defaultTheme } from '../config/themes';
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
import { toast } from 'sonner';

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

export const AddTaskPage = ({ onAddTask, onBack, currentTheme, profile }: AddTaskPageProps) => {
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
    });

    onBack();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <PageHeader 
            title="Create Task" 
            onBack={onBack}
            titleClassName="bg-gradient-to-r bg-clip-text text-transparent"
            titleStyle={{
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Tasks Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="p-3 rounded-xl shadow-lg"
                style={{ 
                  backgroundColor: `${theme?.colors.primary}15`,
                  border: `1px solid ${theme?.colors.primary}30`
                }}
              >
                <Target className="h-6 w-6" style={{ color: theme?.colors.primary }} />
              </div>
              <div>
                <h2 
                  className="text-xl font-semibold bg-gradient-to-r bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
                  }}
                >
                  Quick Task Templates
                </h2>
                <p className="text-sm text-muted-foreground">Choose from pre-made tasks or create your own</p>
              </div>
            </div>

            <Collapsible
              open={isQuickTasksOpen}
              onOpenChange={setIsQuickTasksOpen}
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between h-14 border-2 hover:shadow-lg transition-all duration-300"
                  style={{ 
                    borderColor: `${theme?.colors.primary}30`,
                    backgroundColor: `${theme?.colors.primary}05`
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5" style={{ color: theme?.colors.primary }} />
                    <span className="font-medium">Browse Task Categories</span>
                  </div>
                  <ChevronRight className={`h-5 w-5 transform transition-all duration-300 ${isQuickTasksOpen ? 'rotate-90' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="bg-card rounded-xl border shadow-sm max-h-96 overflow-y-auto">
                  <Accordion type="single" collapsible className="w-full" value={selectedCategory} onValueChange={handleCategorySelect}>
                    {Object.keys(taskCategories).map((category) => (
                      <AccordionItem 
                        value={category} 
                        key={category} 
                        className="border-b last:border-b-0"
                      >
                        <AccordionTrigger className="hover:no-underline px-6 py-4 text-left font-medium hover:bg-muted/50 transition-colors">
                          {category}
                        </AccordionTrigger>
                        <AccordionContent className="pb-0">
                          <div className="px-6">
                            <Accordion type="single" collapsible className="w-full" value={selectedSubCategory} onValueChange={handleSubCategorySelect}>
                              {Object.keys(taskCategories[category as CategoryKey]).map((subCategory) => (
                                <AccordionItem value={subCategory} key={subCategory} className="border border-muted/50 rounded-lg mb-2 last:mb-4">
                                  <AccordionTrigger className="text-sm hover:no-underline px-4 py-3 hover:bg-muted/30 transition-colors rounded-t-lg">
                                    {subCategory}
                                  </AccordionTrigger>
                                  <AccordionContent className="pb-0">
                                    <div className="p-4 space-y-2 bg-muted/20 rounded-b-lg">
                                      {(taskCategories[category as CategoryKey][subCategory as SubCategoryKey<CategoryKey>] as readonly string[]).map((task) => (
                                        <Button
                                          key={task}
                                          variant={selectedTask === task ? "default" : "ghost"}
                                          className="w-full justify-start text-left text-sm font-normal h-auto py-3 px-4 hover:bg-background transition-all duration-200"
                                          onClick={() => handleTaskSelect(task)}
                                          style={selectedTask === task ? { backgroundColor: theme?.colors.primary } : {}}
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
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Task Form */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="p-3 rounded-xl shadow-lg"
                style={{ 
                  backgroundColor: `${theme?.colors.primary}15`,
                  border: `1px solid ${theme?.colors.primary}30`
                }}
              >
                <Plus className="h-6 w-6" style={{ color: theme?.colors.primary }} />
              </div>
              <div>
                <h2 
                  className="text-xl font-semibold bg-gradient-to-r bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
                  }}
                >
                  Task Details
                </h2>
                <p className="text-sm text-muted-foreground">Fill in your task information</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border shadow-sm p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Task Title</label>
                  <Input
                    placeholder="Enter your task..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="h-12 transition-all duration-300 focus:shadow-md border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <Textarea
                    placeholder="Add details about your task..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="transition-all duration-300 focus:shadow-md border-border/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Priority Level</label>
                    <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setPriority(value)}>
                      <SelectTrigger className="h-12 transition-all duration-300 hover:shadow-md border-border/50">
                        {selectedPriorityDetails && (
                          <div className="flex items-center gap-2">
                            <span className={cn("h-3 w-3 rounded-full", selectedPriorityDetails.color)} />
                            <span>{selectedPriorityDetails.label}</span>
                            {selectedPriorityDetails.emoji && <span>{selectedPriorityDetails.emoji}</span>}
                          </div>
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((p) => (
                          <SelectItem key={p.value} value={p.value} className="hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2">
                              <span className={cn("h-3 w-3 rounded-full", p.color)} />
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
                            "w-full h-12 justify-start text-left font-normal transition-all duration-300 hover:shadow-md border-border/50"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(dueDate, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 shadow-xl" align="start">
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
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r text-white"
                  disabled={!title || !selectedCategory}
                  style={{ 
                    background: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`,
                    border: 'none'
                  }}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create Task
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
              <img src="/lovable-uploads/0b3245b2-4eeb-423d-8ab4-93b3c1d6efc8.png" alt="Rick Astley" className="rounded-lg shadow-lg animate-pulse" />
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
