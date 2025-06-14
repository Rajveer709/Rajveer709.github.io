import { CheckSquare, Calendar, Bell, Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
  currentTheme: string;
}

export const LandingPage = ({ onGetStarted, currentTheme }: LandingPageProps & { currentTheme: string }) => {
  const features = [
    {
      icon: <CheckSquare className="w-8 h-8 text-blue-600" />,
      title: "Organize Life Admin Tasks",
      description: "Keep track of bills, appointments, renewals, and all those important tasks that slip through the cracks."
    },
    {
      icon: <Calendar className="w-8 h-8 text-green-600" />,
      title: "Smart Scheduling",
      description: "Set due dates and priorities to stay on top of deadlines with our intuitive calendar system."
    },
    {
      icon: <Bell className="w-8 h-8 text-orange-600" />,
      title: "Never Miss Again",
      description: "Get organized with categorized tasks and visual progress tracking to maintain your life admin."
    },
    {
      icon: <Target className="w-8 h-8 text-purple-600" />,
      title: "Stay Focused",
      description: "Streamlined interface designed specifically for life admin tasks - no distractions, just results."
    }
  ];
  
  const categoryLists = [
    {
      title: "💰 Financial",
      items: ["Utility bills & rent payments", "Insurance premiums", "Tax deadlines", "Subscription renewals"]
    },
    {
      title: "🏥 Health & Wellness",
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
      title: "📱 Digital Life",
      items: ["Password updates", "Backup schedules", "Device upgrades", "Email management"]
    }
  ];

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-lg mr-3 md:mr-4">
              <CheckSquare className="w-8 h-8 md:w-12 md:h-12 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              Life Admin
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl font-medium text-white/90 mb-4">
            Simplify Life. One Task at a Time.
          </p>
          
          <p className="text-base md:text-xl text-white/80 max-w-3xl mx-auto mb-8 px-4">
            The focused task manager for all your important life admin - from bills and appointments 
            to renewals and deadlines. Never let important tasks slip through the cracks again.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-white/30"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-3 text-lg"
            >
              Explore Features
            </Button>
          </div>
        </div>

        {/* Features Grid - Mobile Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 md:mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:-translate-y-1">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/80 text-sm md:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Task Categories Preview - Mobile Responsive */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-white/20">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-6 md:mb-8">
            Organize Every Aspect of Your Life
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryLists.map((category) => (
              <div key={category.title} className="space-y-2">
                <h3 className="font-semibold text-white text-base md:text-lg">{category.title}</h3>
                <ul className="text-xs md:text-sm text-white/80 space-y-1">
                  {category.items.map(item => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - Mobile Responsive */}
        <div className="text-center mt-12 md:mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Take Control?
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto px-4">
            Join thousands who have simplified their life admin with our focused task management system.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 md:px-12 py-3 md:py-4 text-lg md:text-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-white/30"
          >
            Start Organizing Today
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
