import { NavLink } from 'react-router-dom';
import { Home, PlusSquare, Calendar, Settings, Trophy } from 'lucide-react';

export const SidebarNavBar = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/add-task', icon: PlusSquare, label: 'Add Task' },
    { to: '/challenges', icon: Trophy, label: 'Challenges' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="h-screen w-56 bg-card/95 border-r flex flex-col py-8 px-4 gap-2 shadow-lg sticky top-0 z-40">
      <div className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-primary/10 hover:text-primary ${
                isActive ? 'bg-primary/10 text-primary font-bold' : 'text-foreground/70'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}; 