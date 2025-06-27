
import { Profile } from '../pages/Index';
import { AvatarUploader } from './AvatarUploader';
import { useOutletContext } from 'react-router-dom';
import { themes, defaultTheme } from '../config/themes';

interface HeaderProps {
  profile: Profile | null;
  showGreeting: boolean;
  onUpdateProfile: (updatedProfile: Partial<Profile>, avatarFile?: File) => Promise<void>;
}

interface OutletContextType {
  currentTheme?: string;
}

export const Header = ({ profile, showGreeting, onUpdateProfile }: HeaderProps) => {
  const { currentTheme = 'purple' } = useOutletContext<OutletContextType>();
  const theme = themes.find(t => t.value === currentTheme) || themes.find(t => t.value === defaultTheme);

  return (
    <header className={`flex items-center ${showGreeting ? 'justify-between gap-4' : 'justify-end'} mb-8`}>
      {showGreeting && (
        <div className="animate-slide-in-from-left flex-1 min-w-0">
          <h1 
            className="text-xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            Welcome back{profile?.name ? `, ${profile.name}` : ''}!
          </h1>
          <p className="text-muted-foreground truncate">Here's your life at a glance.</p>
        </div>
      )}
      <div className="flex items-center gap-4 animate-fade-in">
        {profile && <AvatarUploader profile={profile} onUpdateProfile={onUpdateProfile} />}
      </div>
    </header>
  );
};
