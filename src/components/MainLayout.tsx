import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { BottomNavBar } from './BottomNavBar';
import { Profile } from '../pages/Index';

interface MainLayoutProps {
  onThemeChange: (theme: string) => void;
  currentTheme: string;
  profile: Profile | null;
  showGreeting: boolean;
  onUpdateProfile: (updatedProfile: Partial<Profile>, avatarFile?: File) => Promise<void>;
}

export const MainLayout = ({
  onThemeChange,
  currentTheme,
  profile,
  showGreeting,
  onUpdateProfile,
}: MainLayoutProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="container mx-auto px-4 pt-4 max-w-sm pb-20">
        {showGreeting && (
          <Header
            profile={profile}
            showGreeting={showGreeting}
            onUpdateProfile={onUpdateProfile}
          />
        )}
        <main>
          <Outlet context={{ profile, onUpdateProfile, showGreeting }} />
        </main>
      </div>
      <BottomNavBar />
    </>
  );
};