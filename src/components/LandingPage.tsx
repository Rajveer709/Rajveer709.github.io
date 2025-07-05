import * as React from 'react';
import { CheckSquare, Calendar, Bell, Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { themes, defaultTheme } from '@/config/themes';

interface LandingPageProps {
  onGetStarted: () => void;
  currentTheme: string;
}

export const LandingPage = ({ onGetStarted, currentTheme }: LandingPageProps) => {
  const theme = themes.find(t => t.value === currentTheme) || themes.find(t => t.value === defaultTheme);

  const features = [
    {
      icon: <CheckSquare className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Organize Life Admin Tasks",
      description: "Keep track of bills, appointments, renewals, and all those important tasks."
    },
    {
      icon: <Calendar className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Smart Scheduling",
      description: "Set due dates and priorities to stay on top of deadlines with our intuitive calendar."
    },
    {
      icon: <Bell className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Never Miss Again",
      description: "Get organized with categorized tasks and visual progress tracking."
    },
    {
      icon: <Target className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Stay Focused",
      description: "Streamlined interface designed specifically for life admin tasks - no distractions."
    }
  ];
  
  const categoryLists = [
    {
      title: "💰 Financial",
      items: ["Utility bills & rent payments", "Insurance premiums", "Tax deadlines", "Subscription renewals"]
    },
    {
      title: "🏥 Health",
      items: ["Doctor appointments", "Medication schedules", "Dental check-ups", "Fitness tracking"]
    },
    {
      title: "🏠 Household",
      items: ["Home maintenance", "Vehicle servicing", "Appliance warranties", "Grocery planning"]
    },
    {
      title: "📋 Legal & Admin",
      items: ["Document renewals", "Form submissions", "Voting registration", "Estate planning"]
    },
    {
      title: "🎯 Personal",
      items: ["Important birthdays", "Travel planning", "Learning goals", "Social events"]
    },
    {
      title: "📱 Digital",
      items: ["Password updates", "Backup schedules", "Device upgrades", "Email management"]
    }
  ];

  return (
    <div className="min-h-screen bg-background/50 overflow-x-hidden">
       <div 
        className="absolute top-0 left-0 w-full h-full -z-10 opacity-10 dark:opacity-20"
        style={{
          backgroundImage: `radial-gradient(${theme?.colors.primary} 1px, transparent 1px), radial-gradient(${theme?.colors.secondary} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
        {/* Hero Section - Optimized for portrait */}
        <div className="text-center mb-12 md:mb-24">
          <div className="flex flex-col items-center justify-center mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="bg-background/20 backdrop-blur-sm p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-lg mb-3 md:mb-4 border">
              <CheckSquare className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            </div>
            <h1 className="text-3xl md:text-6xl font-bold text-primary">
              Life Admin
            </h1>
          </div>
          
          <p className="text-lg md:text-2xl font-medium text-foreground/90 mb-2 animate-fade-in px-2" style={{ animationDelay: '200ms' }}>
            Simplify Life. One Task at a Time.
          </p>
          
          <p className="text-base md:text-xl text-muted-foreground mb-3 animate-fade-in px-2" style={{ animationDelay: '250ms' }}>
            Your personal assistant for life admin tasks
          </p>
          
          <p className="text-sm md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 px-4 animate-fade-in leading-relaxed" style={{ animationDelay: '300ms' }}>
            The focused task manager for all your important life admin - from bills and appointments 
            to renewals and deadlines. Never let important tasks slip through the cracks again.
          </p>

          <div className="animate-fade-in px-4" style={{ animationDelay: '400ms' }}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button 
                onClick={onGetStarted}
                size="lg"
                className="px-6 py-3 text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-200 border-transparent text-white w-full sm:w-auto"
                style={{ backgroundColor: theme?.colors.primary }}
              >
                Get Started for Free
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </Button>
              <Button 
                onClick={onGetStarted}
                size="lg"
                variant="outline"
                className="px-6 py-3 text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
              >
                Add Task
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid - Portrait optimized */}
        <div className="mb-12 md:mb-24">
           <h2 className="text-2xl md:text-4xl font-bold text-center text-foreground mb-8 md:mb-12 animate-fade-in px-4" style={{ animationDelay: '500ms' }}>
            Everything You Need to Get Organized
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
            {features.map((feature, index) => {
              const color = index % 2 === 0 ? theme?.colors.primary : theme?.colors.secondary;
              const bgColor = index % 2 === 0 ? `${theme?.colors.primary}20` : `${theme?.colors.secondary}20`;
              return (
                <div key={index} className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 hover:-translate-y-1 flex items-start gap-3 md:gap-4 animate-fade-in" style={{ animationDelay: `${600 + index * 100}ms`}}>
                  <div className="p-2 md:p-3 rounded-full flex-shrink-0" style={{backgroundColor: bgColor}}>
                    {React.cloneElement(feature.icon, { style: { color: color } })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-xl font-semibold text-foreground mb-1 md:mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Categories Preview - Portrait optimized */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-8 shadow-lg border border-border/50 mb-12 md:mb-24 animate-fade-in mx-2" style={{ animationDelay: '1000ms' }}>
          <h2 className="text-2xl md:text-4xl font-bold text-center text-foreground mb-6 md:mb-10">
            Organize Every Aspect of Your Life
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {categoryLists.map((category) => (
              <div key={category.title} className="space-y-2 md:space-y-3">
                <h3 className="font-semibold text-foreground text-sm md:text-lg flex items-center gap-2">
                  <span className="text-lg md:text-2xl">{category.title.split(' ')[0]}</span>
                  <span className="text-sm md:text-base">{category.title.split(' ').slice(1).join(' ')}</span>
                </h3>
                <ul className="text-xs md:text-sm text-muted-foreground space-y-1 md:space-y-1.5 pl-1 md:pl-2">
                  {category.items.map(item => 
                    <li key={item} className="flex items-start gap-1.5 md:gap-2">
                      <CheckSquare className="w-2.5 h-2.5 md:w-3 md:h-3 mt-0.5 flex-shrink-0 text-primary" />
                      <span className="leading-tight">{item}</span>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - Portrait optimized */}
        <div className="text-center animate-fade-in px-4" style={{ animationDelay: '1200ms' }}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Ready to Take Control?
          </h2>
          <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Stop juggling tasks in your head. Start organizing your life admin today and reclaim your peace of mind.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="px-6 md:px-12 py-3 md:py-4 text-base md:text-xl shadow-lg hover:shadow-xl transition-all duration-200 border-transparent text-white"
             style={{ backgroundColor: theme?.colors.primary }}
          >
            Start Organizing Today
            <ArrowRight className="w-4 h-4 md:w-6 md:h-6 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};