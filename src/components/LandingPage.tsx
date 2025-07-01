
import * as React from 'react';
import { CheckSquare, Calendar, Bell, Target, ArrowRight, Users, Shield, Clock, Plus } from 'lucide-react';
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
      icon: <CheckSquare className="w-6 h-6" />,
      title: "Smart Organization",
      description: "Keep your life organized with intelligent task categorization and priority management."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Easy Scheduling",
      description: "Never miss important dates with smart calendar integration and reminders."
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Timely Reminders",
      description: "Stay on top of everything with intelligent notifications and alerts."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Goal Achievement",
      description: "Track your progress and achieve your goals with focused productivity tools."
    }
  ];
  
  const benefits = [
    {
      icon: <Users className="w-5 h-5" />,
      title: "Easy to Use",
      description: "Simple and intuitive interface designed for everyone"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Secure & Private",
      description: "Your data is protected with industry-standard security"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Save Time",
      description: "Streamline your daily tasks and boost productivity"
    }
  ];

  const categoryLists = [
    {
      title: "Personal Life",
      items: ["Daily routines", "Health tracking", "Family activities", "Personal goals"]
    },
    {
      title: "Work & Career",
      items: ["Project management", "Meeting schedules", "Skill development", "Professional goals"]
    },
    {
      title: "Home & Living",
      items: ["Household chores", "Maintenance tasks", "Shopping lists", "Bill reminders"]
    },
    {
      title: "Health & Wellness",
      items: ["Exercise routines", "Medical appointments", "Wellness goals", "Habit tracking"]
    },
    {
      title: "Learning & Growth",
      items: ["Study schedules", "Course progress", "Reading lists", "Skill building"]
    },
    {
      title: "Social & Fun",
      items: ["Event planning", "Friend activities", "Hobbies", "Entertainment"]
    }
  ];

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-background via-background to-muted/20 px-4 py-6">
      <div className="container mx-auto max-w-md">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6 animate-fade-in opacity-0" style={{ animationDelay: '100ms' }}>
            <div className="bg-card/30 backdrop-blur-sm p-3 rounded-2xl shadow-xl mr-3 border border-border/20">
              <CheckSquare className="w-10 h-10" style={{ color: theme?.colors.primary }} />
            </div>
            <h1 
              className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
              }}
            >
              Life Admin
            </h1>
          </div>
          
          <h2 
            className="text-xl font-semibold mb-4 bg-gradient-to-r bg-clip-text text-transparent animate-fade-in opacity-0" 
            style={{ 
              animationDelay: '200ms',
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Your Life, Organized
          </h2>
          
          <p className="text-base text-muted-foreground mb-8 leading-relaxed animate-fade-in opacity-0" style={{ animationDelay: '300ms' }}>
            Take control of your daily life with our simple and powerful task management app. 
            Perfect for anyone looking to stay organized and productive.
          </p>

          <div className="flex flex-col gap-3 animate-fade-in opacity-0" style={{ animationDelay: '400ms' }}>
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="w-full py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-white"
              style={{ backgroundColor: theme?.colors.primary }}
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              onClick={onGetStarted}
              size="lg"
              variant="outline"
              className="w-full py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 border-2"
              style={{ borderColor: theme?.colors.primary, color: theme?.colors.primary }}
            >
              Add Tasks
              <Plus className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-12">
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-card/30 backdrop-blur-sm rounded-xl border border-border/20 animate-fade-in opacity-0" style={{ animationDelay: `${500 + index * 100}ms` }}>
                <div className="p-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/30 flex-shrink-0">
                  {React.cloneElement(benefit.icon, { style: { color: theme?.colors.primary } })}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 
            className="text-2xl font-bold text-center mb-8 animate-fade-in opacity-0 bg-gradient-to-r bg-clip-text text-transparent" 
            style={{ 
              animationDelay: '600ms',
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Everything You Need
          </h2>
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border/20 hover:shadow-2xl transition-all duration-500 animate-fade-in opacity-0" style={{ animationDelay: `${700 + index * 100}ms`}}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border/30 flex-shrink-0">
                    {React.cloneElement(feature.icon, { style: { color: theme?.colors.primary } })}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-card/30 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/20 mb-12 animate-fade-in opacity-0" style={{ animationDelay: '1000ms' }}>
          <h2 
            className="text-2xl font-bold text-center mb-8 bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Manage Every Part of Life
          </h2>
          
          <div className="space-y-6">
            {categoryLists.map((category, index) => (
              <div key={category.title} className="animate-fade-in opacity-0" style={{ animationDelay: `${1100 + index * 100}ms` }}>
                <h3 className="text-lg font-semibold mb-3 text-foreground">{category.title}</h3>
                <div className="grid grid-cols-1 gap-2">
                  {category.items.map(item => (
                    <div key={item} className="flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-card/20">
                      <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: theme?.colors.primary }} />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in opacity-0 pb-6" style={{ animationDelay: '1400ms' }}>
          <h2 
            className="text-2xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Ready to Get Organized?
          </h2>
          <p className="text-base text-muted-foreground mb-6 leading-relaxed">
            Join thousands of people who have simplified their lives and boosted their productivity.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="w-full py-4 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-white"
            style={{ backgroundColor: theme?.colors.primary }}
          >
            Get Started for Free
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
