
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
      icon: <CheckSquare className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Task Organization",
      description: "Streamline your administrative tasks with intelligent categorization and priority management."
    },
    {
      icon: <Calendar className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Smart Scheduling",
      description: "Advanced calendar integration with deadline tracking and automated reminders."
    },
    {
      icon: <Bell className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Intelligent Notifications",
      description: "Proactive alerts ensure you never miss critical deadlines or important tasks."
    },
    {
      icon: <Target className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Focused Productivity",
      description: "Purpose-built interface designed for maximum efficiency and minimal distractions."
    }
  ];
  
  const benefits = [
    {
      icon: <Users className="w-5 h-5" />,
      title: "Professional Grade",
      description: "Enterprise-level task management for personal and professional use"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Secure & Reliable",
      description: "Your data is protected with industry-standard security measures"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Time Efficiency",
      description: "Reduce administrative overhead by up to 60% with smart automation"
    }
  ];

  const categoryLists = [
    {
      title: "Financial Management",
      items: ["Payment processing", "Invoice tracking", "Budget oversight", "Subscription management"]
    },
    {
      title: "Healthcare Administration",
      items: ["Appointment scheduling", "Medical records", "Insurance coordination", "Wellness tracking"]
    },
    {
      title: "Property & Assets",
      items: ["Maintenance scheduling", "Documentation", "Service coordination", "Compliance tracking"]
    },
    {
      title: "Legal & Compliance",
      items: ["Document management", "Regulatory compliance", "Contract tracking", "Audit preparation"]
    },
    {
      title: "Professional Development",
      items: ["Goal tracking", "Skill development", "Network management", "Career planning"]
    },
    {
      title: "Digital Infrastructure",
      items: ["System maintenance", "Security updates", "Data management", "Workflow optimization"]
    }
  ];

  return (
    <div className="min-h-screen font-sans overflow-x-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-24">
          <div className="flex items-center justify-center mb-6 md:mb-8 animate-fade-in opacity-0" style={{ animationDelay: '100ms' }}>
            <div className="bg-card/30 backdrop-blur-sm p-3 md:p-4 rounded-2xl shadow-xl mr-4 border border-border/20">
              <CheckSquare className="w-8 h-8 md:w-12 md:h-12" style={{ color: theme?.colors.primary }} />
            </div>
            <h1 
              className="text-4xl md:text-7xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
              }}
            >
              Life Admin
            </h1>
          </div>
          
          <h2 
            className="text-xl md:text-3xl font-semibold mb-4 md:mb-6 bg-gradient-to-r bg-clip-text text-transparent animate-fade-in opacity-0" 
            style={{ 
              animationDelay: '200ms',
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Professional Task Management
          </h2>
          
          <p className="text-base md:text-xl text-muted-foreground max-w-4xl mx-auto mb-8 md:mb-12 leading-relaxed animate-fade-in opacity-0" style={{ animationDelay: '300ms' }}>
            Streamline your administrative workflows with our comprehensive task management platform. 
            Designed for professionals who demand efficiency, reliability, and results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in opacity-0" style={{ animationDelay: '400ms' }}>
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white"
              style={{ backgroundColor: theme?.colors.primary }}
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              onClick={onGetStarted}
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2"
              style={{ borderColor: theme?.colors.primary, color: theme?.colors.primary }}
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16 md:mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center animate-fade-in opacity-0" style={{ animationDelay: `${500 + index * 100}ms` }}>
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-card/50 backdrop-blur-sm border border-border/30">
                    {React.cloneElement(benefit.icon, { style: { color: theme?.colors.primary } })}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16 md:mb-24">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 animate-fade-in opacity-0 bg-gradient-to-r bg-clip-text text-transparent" 
            style={{ 
              animationDelay: '600ms',
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Comprehensive Solution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-border/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in opacity-0" style={{ animationDelay: `${700 + index * 100}ms`}}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border/30">
                    {React.cloneElement(feature.icon, { style: { color: theme?.colors.primary } })}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-card/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-border/20 mb-16 md:mb-24 animate-fade-in opacity-0" style={{ animationDelay: '1000ms' }}>
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Comprehensive Coverage
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryLists.map((category, index) => (
              <div key={category.title} className="animate-fade-in opacity-0" style={{ animationDelay: `${1100 + index * 100}ms` }}>
                <h3 className="text-xl font-semibold mb-4 text-foreground">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map(item => (
                    <li key={item} className="flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors">
                      <CheckSquare className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: theme?.colors.primary }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in opacity-0" style={{ animationDelay: '1400ms' }}>
          <h2 
            className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who have streamlined their administrative tasks and reclaimed their time.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="px-12 py-4 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white"
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
