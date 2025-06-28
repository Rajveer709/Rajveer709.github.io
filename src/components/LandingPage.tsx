
import * as React from 'react';
import { CheckSquare, Calendar, Bell, Target, ArrowRight, Users, Shield, Clock } from 'lucide-react';
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
      title: "Smart Organization",
      description: "Organize your tasks efficiently with intelligent categorization and priority management."
    },
    {
      icon: <Calendar className="w-5 h-5 md:w-6 md:h-6" />,
      title: "Schedule Management",
      description: "Keep track of deadlines and never miss important dates with smart reminders."
    },
    {
      icon: <Bell className="w-5 h-5 md:w-6 md:h-6" />,
      title: "Smart Notifications",
      description: "Get timely alerts and reminders to stay on top of your tasks and goals."
    },
    {
      icon: <Target className="w-5 h-5 md:w-6 md:h-6" />,
      title: "Goal Achievement",
      description: "Track your progress and achieve your goals with gamified challenges and rewards."
    }
  ];
  
  const benefits = [
    {
      icon: <Users className="w-4 h-4" />,
      title: "User-Friendly",
      description: "Intuitive design that works for everyone"
    },
    {
      icon: <Shield className="w-4 h-4" />,
      title: "Secure & Private",
      description: "Your data is protected and secure"
    },
    {
      icon: <Clock className="w-4 h-4" />,
      title: "Save Time",
      description: "Boost your productivity and get more done"
    }
  ];

  const categoryLists = [
    {
      title: "Personal Tasks",
      items: ["Daily routines", "Health & fitness", "Shopping lists", "Personal goals"]
    },
    {
      title: "Work & Career",
      items: ["Project management", "Meeting schedules", "Deadlines", "Skill development"]
    },
    {
      title: "Home & Family",
      items: ["Household chores", "Family events", "Maintenance tasks", "Budget planning"]
    },
    {
      title: "Education & Learning",
      items: ["Study schedules", "Assignment tracking", "Course deadlines", "Progress monitoring"]
    }
  ];

  return (
    <div className="min-h-screen font-sans overflow-x-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 max-w-md sm:max-w-2xl md:max-w-7xl">
        {/* Hero Section - Mobile Optimized */}
        <div className="text-center mb-12 md:mb-24">
          <div className="flex flex-col items-center justify-center mb-6 animate-fade-in opacity-0" style={{ animationDelay: '100ms' }}>
            <div className="bg-card/30 backdrop-blur-sm p-3 rounded-2xl shadow-xl mb-4 border border-border/20">
              <CheckSquare className="w-10 h-10 md:w-12 md:h-12" style={{ color: theme?.colors.primary }} />
            </div>
            <h1 
              className="text-3xl sm:text-4xl md:text-7xl font-bold bg-gradient-to-r bg-clip-text text-transparent leading-tight"
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
              }}
            >
              Life Admin
            </h1>
          </div>
          
          <h2 
            className="text-lg sm:text-xl md:text-3xl font-semibold mb-4 bg-gradient-to-r bg-clip-text text-transparent animate-fade-in opacity-0" 
            style={{ 
              animationDelay: '200ms',
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Your Personal Task Manager
          </h2>
          
          <p className="text-sm sm:text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in opacity-0 px-4" style={{ animationDelay: '300ms' }}>
            Streamline your daily tasks, achieve your goals, and boost your productivity with our intuitive task management platform.
          </p>

          <div className="flex flex-col gap-3 justify-center animate-fade-in opacity-0 px-4" style={{ animationDelay: '400ms' }}>
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white"
              style={{ backgroundColor: theme?.colors.primary }}
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              onClick={() => window.location.href = '/auth'}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2"
              style={{ borderColor: theme?.colors.primary, color: theme?.colors.primary }}
            >
              Add Tasks
            </Button>
          </div>
        </div>

        {/* Benefits Section - Mobile Grid */}
        <div className="mb-12 md:mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center animate-fade-in opacity-0 px-4" style={{ animationDelay: `${500 + index * 100}ms` }}>
                <div className="mb-3 flex justify-center">
                  <div className="p-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/30">
                    {React.cloneElement(benefit.icon, { style: { color: theme?.colors.primary } })}
                  </div>
                </div>
                <h3 className="text-base font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid - Mobile Stacked */}
        <div className="mb-12 md:mb-24">
          <h2 
            className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16 animate-fade-in opacity-0 bg-gradient-to-r bg-clip-text text-transparent px-4" 
            style={{ 
              animationDelay: '600ms',
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in opacity-0" style={{ animationDelay: `${700 + index * 100}ms`}}>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-card/50 backdrop-blur-sm border border-border/30 flex-shrink-0">
                    {React.cloneElement(feature.icon, { style: { color: theme?.colors.primary } })}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Section - Mobile Optimized */}
        <div className="bg-card/30 backdrop-blur-sm rounded-3xl p-6 md:p-12 shadow-xl border border-border/20 mb-12 md:mb-24 animate-fade-in opacity-0 mx-4" style={{ animationDelay: '1000ms' }}>
          <h2 
            className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16 bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Perfect for Any Lifestyle
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {categoryLists.map((category, index) => (
              <div key={category.title} className="animate-fade-in opacity-0" style={{ animationDelay: `${1100 + index * 100}ms` }}>
                <h3 className="text-lg font-semibold mb-3 text-foreground">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map(item => (
                    <li key={item} className="flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors text-sm">
                      <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: theme?.colors.primary }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - Mobile Centered */}
        <div className="text-center animate-fade-in opacity-0 px-4" style={{ animationDelay: '1400ms' }}>
          <h2 
            className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Ready to Get Organized?
          </h2>
          <p className="text-base md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who have transformed their productivity and achieved their goals.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="w-full sm:w-auto px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white"
            style={{ backgroundColor: theme?.colors.primary }}
          >
            Start Your Journey
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
