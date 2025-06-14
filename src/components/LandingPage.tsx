
import { CheckSquare, Calendar, Bell, Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-3xl shadow-lg mr-4">
              <CheckSquare className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Life Admin
            </h1>
          </div>
          
          <p className="text-2xl font-semibold text-gray-700 mb-4">
            Simplify Life. One Task at a Time.
          </p>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            The focused task manager for all your important life admin - from bills and appointments 
            to renewals and deadlines. Never let important tasks slip through the cracks again.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-3 text-lg"
            >
              Explore Features
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Task Categories Preview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Organize Every Aspect of Your Life
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-600 text-lg">💰 Financial</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Utility bills & rent payments</li>
                <li>• Insurance premiums</li>
                <li>• Tax deadlines</li>
                <li>• Subscription renewals</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-green-600 text-lg">🏥 Health & Wellness</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Doctor appointments</li>
                <li>• Medication schedules</li>
                <li>• Dental check-ups</li>
                <li>• Fitness tracking</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-orange-600 text-lg">🏠 Household</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Home maintenance</li>
                <li>• Vehicle servicing</li>
                <li>• Appliance warranties</li>
                <li>• Grocery planning</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-purple-600 text-lg">📋 Legal & Admin</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Document renewals</li>
                <li>• Form submissions</li>
                <li>• Voting registration</li>
                <li>• Estate planning</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-indigo-600 text-lg">🎯 Personal</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Important birthdays</li>
                <li>• Travel planning</li>
                <li>• Learning goals</li>
                <li>• Social events</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-pink-600 text-lg">📱 Digital Life</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Password updates</li>
                <li>• Backup schedules</li>
                <li>• Device upgrades</li>
                <li>• Email management</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Take Control?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands who have simplified their life admin with our focused task management system.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 text-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Organizing Today
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
