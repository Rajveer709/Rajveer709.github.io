
import * as React from 'react';
import { CheckSquare, Calendar, Bell, Target, ArrowRight, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen font-sans overflow-x-hidden">
      <div 
        className="absolute top-0 left-0 w-full h-full -z-10 opacity-5 dark:opacity-10"
        style={{
          backgroundImage: `radial-gradient(${theme?.colors.primary} 1px, transparent 1px), radial-gradient(${theme?.colors.secondary} 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px',
        }}
      />
      <div className="container mx-auto px-3 py-8 md:py-16 max-w-sm md:max-w-6xl">
        {/* Hero Section - Mobile Optimized */}
        <div className="text-center mb-12 md:mb-24">
          <div className="flex items-center justify-center mb-4 md:mb-6 animate-fade-in opacity-0" style={{ animationDelay: '100ms' }}>
            <div className="bg-card/20 backdrop-blur-sm p-2 md:p-4 rounded-xl md:rounded-3xl shadow-lg mr-2 md:mr-4 border border-border/20 hover:scale-105 transition-all duration-300">
              <CheckSquare className="w-6 h-6 md:w-12 md:h-12" style={{ color: theme?.colors.primary }} />
            </div>
            <h1 
              className="text-3xl md:text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent animate-pulse"
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
              }}
            >
              Life Admin
            </h1>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5" style={{ color: theme?.colors.secondary }} />
            <p 
              className="text-lg md:text-2xl font-medium bg-gradient-to-r bg-clip-text text-transparent animate-fade-in opacity-0" 
              style={{ 
                animationDelay: '200ms',
                backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
              }}
            >
              Simplify Life. One Task at a Time.
            </p>
            <Sparkles className="w-4 h-4 md:w-5 md:h-5" style={{ color: theme?.colors.secondary }} />
          </div>
          
          <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 px-2 md:px-4 animate-fade-in opacity-0" style={{ animationDelay: '300ms' }}>
            The focused task manager for all your important life admin - from bills and appointments 
            to renewals and deadlines. Never let important tasks slip through the cracks again.
          </p>

          <div className="animate-fade-in opacity-0" style={{ animationDelay: '400ms' }}>
            <div className="flex flex-col gap-3 md:gap-4">
              <Button 
                onClick={onGetStarted}
                size="lg"
                className="px-6 py-3 md:px-8 md:py-3 text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-transparent text-white w-full"
                style={{ backgroundColor: theme?.colors.primary }}
              >
                Get Started for Free
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button 
                onClick={onGetStarted}
                size="lg"
                variant="outline"
                className="px-6 py-3 md:px-8 md:py-3 text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full border-2"
                style={{ borderColor: theme?.colors.primary, color: theme?.colors.primary }}
              >
                Add Task
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid - Mobile Optimized */}
        <div className="mb-12 md:mb-24">
          <h2 
            className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 animate-fade-in opacity-0 bg-gradient-to-r bg-clip-text text-transparent" 
            style={{ 
              animationDelay: '500ms',
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Everything You Need to Get Organized
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {features.map((feature, index) => {
              const color = index % 2 === 0 ? theme?.colors.primary : theme?.colors.secondary;
              const bgColor = index % 2 === 0 ? `${theme?.colors.primary}15` : `${theme?.colors.secondary}15`;
              return (
                <div key={index} className="bg-card/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-border/30 hover:-translate-y-1 md:hover:-translate-y-2 hover:scale-105 flex items-start gap-3 md:gap-4 animate-fade-in opacity-0 group" style={{ animationDelay: `${600 + index * 100}ms`}}>
                  <div className="p-2 md:p-3 rounded-full transition-all duration-300 group-hover:scale-110 flex-shrink-0" style={{backgroundColor: bgColor}}>
                    {React.cloneElement(feature.icon, { style: { color: color } })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-xl font-semibold text-foreground mb-1 md:mb-2 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Categories Preview - Mobile Optimized */}
        <div className="bg-card/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-8 shadow-lg border border-border/30 mb-12 md:mb-24 animate-fade-in opacity-0 hover:shadow-xl transition-all duration-500" style={{ animationDelay: '1000ms' }}>
          <h2 
            className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-10 bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Organize Every Aspect of Your Life
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {categoryLists.map((category, index) => (
              <div key={category.title} className="space-y-2 md:space-y-3 animate-slide-in-from-left opacity-0" style={{ animationDelay: `${1200 + index * 100}ms` }}>
                <h3 
                  className="font-semibold text-sm md:text-lg flex items-center gap-2 transition-colors duration-300 bg-gradient-to-r bg-clip-text text-transparent hover:scale-105 transform transition-transform"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
                  }}
                >
                  <span className="text-lg md:text-2xl">{category.title.split(' ')[0]}</span>
                  {category.title.split(' ').slice(1).join(' ')}
                </h3>
                <ul className="text-xs md:text-sm text-muted-foreground space-y-1 md:space-y-1.5 pl-1 md:pl-2">
                  {category.items.map(item => 
                    <li key={item} className="flex items-start gap-2 hover:text-foreground transition-colors duration-300">
                      <CheckSquare className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: theme?.colors.primary }} />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - Mobile Optimized */}
        <div className="text-center animate-fade-in opacity-0" style={{ animationDelay: '1400ms' }}>
          <h2 
            className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Ready to Take Control?
          </h2>
          <p className="text-sm md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto px-2 md:px-4 leading-relaxed">
            Stop juggling tasks in your head. Start organizing your life admin today and reclaim your peace of mind.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="px-6 py-3 md:px-12 md:py-4 text-base md:text-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-transparent text-white group w-full md:w-auto"
            style={{ backgroundColor: theme?.colors.primary }}
          >
            Start Organizing Today
            <ArrowRight className="w-4 h-4 md:w-6 md:h-6 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
