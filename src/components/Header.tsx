
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsDialog } from './SettingsDialog';

interface HeaderProps {
  onThemeChange: (theme: string) => void;
  currentTheme: string;
  onCalendarClick: () => void;
}

export const Header = ({ onThemeChange, currentTheme, onCalendarClick }: HeaderProps) => {
  return (
    <header className="flex items-center justify-end mb-8">
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
