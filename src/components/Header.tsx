import { SettingsDialog } from './SettingsDialog';

interface Profile {
  name: string | null;
}

interface HeaderProps {
  onThemeChange: (theme: string) => void;
  currentTheme: string;
  onCalendarClick: () => void;
  profile: Profile | null;
  showGreeting: boolean;
}

export const Header = ({ onThemeChange, currentTheme, onCalendarClick, profile, showGreeting }: HeaderProps) => {
  return (
    <header className={`flex items-center ${showGreeting ? 'justify-between' : 'justify-end'} mb-8`}>
      {showGreeting && (
        <div className="animate-slide-in-from-left">
          <h1 className="text-2xl font-bold text-primary mb-1">
            Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-muted-foreground">Here's your life at a glance.</p>
        </div>
      )}
      <div className="flex items-center gap-2 animate-fade-in">
        {/* Desktop-only buttons removed for consistent portrait mode */}
      </div>
    </header>
  );
};
