
import { NavLink } from 'react-router-dom';
import { Home, PlusSquare, Calendar, Settings, Trophy } from 'lucide-react';

export const BottomNavBar = () => {
  const navItems = [
    { to: '/app', icon: Home, label: 'Home' },
    { to: '/app/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/app/add-task', icon: PlusSquare, label: 'Add Task' },
    { to: '/app/challenges', icon: Trophy, label: 'Challenges' },
  ];

  const linkClasses = "flex flex-col items-center justify-center gap-1 transition-all duration-200 ease-in-out text-foreground/60 hover:text-primary";
  const activeLinkClasses = "!text-primary transform scale-110";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t h-16 z-50">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === '/app'}
            className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
        <NavLink
          to="/app/settings"
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs font-medium">Settings</span>
        </NavLink>
      </div>
    </nav>
  );
};
