import { NavLink } from 'react-router-dom';
import { Home, PlusSquare, Calendar, Settings, Trophy } from 'lucide-react';

export const BottomNavBar = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/add-task', icon: PlusSquare, label: 'Add Task' },
    { to: '/challenges', icon: Trophy, label: 'Challenges' },
  ];

  const linkClasses = "flex flex-col items-center justify-center gap-1 transition-all duration-200 ease-in-out text-foreground/60 hover:text-primary min-h-[48px] px-2";
  const activeLinkClasses = "!text-primary transform scale-110";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t h-16 z-50 safe-area-pb">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
        <NavLink
          to="/settings"
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs font-medium">Settings</span>
        </NavLink>
      </div>
    </nav>
  );
};