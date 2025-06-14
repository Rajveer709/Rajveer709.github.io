
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsDialog } from './SettingsDialog';

interface Profile {
  name: string | null;
}

interface HeaderProps {
  onThemeChange: (theme: string) => void;
  currentTheme: string;
  onCalendarClick: () => void;
  profile: Profile | null;
}

export const Header = ({ onThemeChange, currentTheme, onCalendarClick, profile }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1">
          Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-muted-foreground">Here's your life at a glance.</p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCalendarClick}
          className="hidden md:inline-flex text-foreground/80 hover:text-foreground hover:bg-foreground/10"
        >
          <Calendar className="w-5 h-5" />
        </Button>
        <div className="hidden md:block">
          <SettingsDialog onThemeChange={onThemeChange} currentTheme={currentTheme} />
        </div>
      </div>
    </header>
  );
};
