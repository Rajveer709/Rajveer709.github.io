import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { BottomNavBar } from './BottomNavBar';
import { Profile } from '../pages/Index';
import { useEffect, useState } from 'react';
import { SidebarNavBar } from './SidebarNavBar.tsx';

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
  const [desktopView, setDesktopView] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('desktopView');
    setDesktopView(stored === 'true');
  }, []);

  return (
    <div className="responsive-app-container">
      <div className={desktopView ? "flex min-h-screen" : "container mx-auto px-4 pt-4 max-w-sm pb-20 mt-4 mb-2"}>
        {desktopView && <SidebarNavBar />}
        <div className={desktopView ? "flex-1 px-8 py-8 max-w-6xl mx-auto" : undefined}>
          {showGreeting && (
            <Header
              profile={profile}
              showGreeting={showGreeting}
              onUpdateProfile={onUpdateProfile}
            />
          )}
          <main>
            <Outlet context={{ profile, onUpdateProfile, showGreeting, desktopView }} />
          </main>
        </div>
      </div>
      {!desktopView && <BottomNavBar />}
    </div>
  );
};