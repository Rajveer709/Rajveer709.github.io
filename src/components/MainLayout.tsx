
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { BottomNavBar } from './BottomNavBar';

interface MainLayoutProps {
  onThemeChange: (theme: string) => void;
  currentTheme: string;
  profile: any; // Using any to avoid refactoring read-only files
  showGreeting: boolean;
}

export const MainLayout = ({
  onThemeChange,
  currentTheme,
  profile,
  showGreeting,
}: MainLayoutProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="container mx-auto px-4 pt-6 max-w-sm pb-20">
        <Header
          onThemeChange={onThemeChange}
          currentTheme={currentTheme}
          onCalendarClick={() => navigate('/calendar')}
          profile={profile}
          showGreeting={showGreeting}
        />
        <main>
          <Outlet />
        </main>
      </div>
      <BottomNavBar />
    </>
  );
};
