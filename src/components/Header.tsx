
import { CheckSquare, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsDialog } from './SettingsDialog';

interface HeaderProps {
  onThemeChange: (theme: string) => void;
  currentTheme: string;
  onCalendarClick: () => void;
}

export const Header = ({ onThemeChange, currentTheme, onCalendarClick }: HeaderProps) => {
  return (
    <div className="text-center mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1"></div>
        <div className="flex items-center justify-center">
          <div className="bg-primary/10 p-2 md:p-3 rounded-xl md:rounded-2xl shadow-lg mr-3 md:mr-4">
            <CheckSquare className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-primary">
            Life Admin
          </h1>
        </div>
        <div className="flex-1 flex justify-end gap-2">
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
      </div>
    </div>
  );
};
