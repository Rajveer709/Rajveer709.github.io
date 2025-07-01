
import { Profile } from '../pages/Index';
import { AvatarUploader } from './AvatarUploader';

interface HeaderProps {
  profile: Profile | null;
  showGreeting: boolean;
  onUpdateProfile: (updatedProfile: Partial<Profile>, avatarFile?: File) => Promise<void>;
}

export const Header = ({ profile, showGreeting, onUpdateProfile }: HeaderProps) => {
  return (
    <header className={`flex items-center ${showGreeting ? 'justify-between gap-4' : 'justify-end'} mb-8`}>
      {showGreeting && (
        <div className="animate-slide-in-from-left flex-1 min-w-0">
          <h1 className="text-xl font-bold text-primary mb-1">
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
