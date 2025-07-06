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
      icon: <CheckSquare className="w-5 h-5 md:w-6 md:h-6" />,
      title: "Organize Life Admin Tasks",
      description: "Keep track of bills, appointments, renewals, and all those important tasks."
    },
    {
      icon: <Calendar className="w-5 h-5 md:w-6 md:h-6" />,
      title: "Smart Scheduling",
      description: "Set due dates and priorities to stay on top of deadlines with our intuitive calendar."
    },
    {
      icon: <Bell className="w-5 h-5 md:w-6 md:h-6" />,
      title: "Never Miss Again",
      description: "Get organized with categorized tasks and visual progress tracking."
    },
    {
      icon: <Target className="w-5 h-5 md:w-6 md:h-6" />,
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
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden">
      {/* Enhanced background with better dark mode support */}
      <div 
        className="absolute inset-0 -z-10 opacity-30 dark:opacity-20 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, ${theme?.colors.primary}40 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${theme?.colors.secondary}40 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, ${theme?.colors.primary}20 0%, transparent 70%)
          `,
        }}
      />
      
      <div className="w-full max-w-md mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center space-y-8">
        {/* Hero Section - Optimized for mobile */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div 
              className="bg-card/60 dark:bg-card/40 backdrop-blur-lg p-3 md:p-4 rounded-2xl shadow-xl border border-border/50 flex items-center justify-center"
              style={{
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
            >
              <CheckSquare className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
                Life Admin
              </h1>
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-primary/70" />
                <p className="text-base md:text-lg font-medium text-foreground/90">
                  Simplify Life. One Task at a Time.
                </p>
                <Sparkles className="w-4 h-4 text-primary/70" />
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm md:text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Your personal assistant for life admin tasks - from bills and appointments 
              to renewals and deadlines. Never let important tasks slip through the cracks again.
            </p>

            <Button 
              onClick={onGetStarted}
              size="lg"
              className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0"
              style={{ 
                background: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`,
                color: 'white'
              }}
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Features Grid - Compact mobile design */}
        <div className="w-full space-y-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h2 className="text-xl md:text-2xl font-bold text-center text-foreground">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {features.map((feature, index) => {
              const color = index % 2 === 0 ? theme?.colors.primary : theme?.colors.secondary;
              const bgColor = index % 2 === 0 ? `${theme?.colors.primary}15` : `${theme?.colors.secondary}15`;
              return (
                <div 
                  key={index} 
                  className="bg-card/70 dark:bg-card/50 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-border/30 hover:border-border/60 flex items-start gap-3"
                  style={{ animationDelay: `${300 + index * 100}ms`}}
                >
                  <div 
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{backgroundColor: bgColor}}
                  >
                    {React.cloneElement(feature.icon, { style: { color: color } })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Categories Preview - Compact design */}
        <div 
          className="bg-card/60 dark:bg-card/40 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-border/50 w-full animate-fade-in" 
          style={{ 
            animationDelay: '600ms',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2 className="text-lg md:text-xl font-bold text-center text-foreground mb-4">
            Organize Every Aspect of Your Life
          </h2>
          
          <div className="grid grid-cols-1 gap-3">
            {categoryLists.map((category) => (
              <div key={category.title} className="space-y-2">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <span className="text-base">{category.title.split(' ')[0]}</span>
                  <span className="text-xs">{category.title.split(' ').slice(1).join(' ')}</span>
                </h3>
                <ul className="text-xs text-muted-foreground space-y-1 pl-2">
                  {category.items.slice(0, 2).map(item => 
                    <li key={item} className="flex items-start gap-2">
                      <CheckSquare className="w-2.5 h-2.5 mt-0.5 flex-shrink-0 text-primary/70" />
                      <span className="leading-tight">{item}</span>
                    </li>
                  )}
                  {category.items.length > 2 && (
                    <li className="text-primary/70 text-xs pl-4">
                      +{category.items.length - 2} more...
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '800ms' }}>
          <h2 className="text-lg md:text-xl font-bold text-foreground">
            Ready to Take Control?
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Stop juggling tasks in your head. Start organizing your life admin today.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0"
            style={{ 
              background: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`,
              color: 'white'
            }}
          >
            Start Organizing Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};