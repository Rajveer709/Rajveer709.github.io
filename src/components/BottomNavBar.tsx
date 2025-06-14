
import { NavLink } from 'react-router-dom';
import { Home, PlusSquare, Calendar } from 'lucide-react';
import { SettingsDialog } from './SettingsDialog';
import { Button } from './ui/button';

interface BottomNavBarProps {
  onThemeChange: (theme: string) => void;
  currentTheme: string;
}

export const BottomNavBar = ({ onThemeChange, currentTheme }: BottomNavBarProps) => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/add-task', icon: PlusSquare, label: 'Add Task' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
  ];

  const linkClasses = "flex flex-col items-center justify-center gap-1 transition-colors text-foreground/60 hover:text-primary";
  const activeLinkClasses = "!text-primary";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t h-16 z-50 md:hidden">
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
        <div className={linkClasses}>
          <SettingsDialog onThemeChange={onThemeChange} currentTheme={currentTheme} />
          <span className="text-xs font-medium -mt-1.5">Settings</span>
        </div>
      </div>
    </nav>
  );
};
