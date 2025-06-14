import { ArrowLeft, Moon, Sun, User, Palette, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { themes } from '../config/themes';

interface SettingsPageProps {
  onBack: () => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsPage = ({ onBack, currentTheme, onThemeChange, isDarkMode, onToggleDarkMode }: SettingsPageProps) => {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="w-5 h-5" />
            <span>Account</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Demo User</p>
              <p className="text-sm text-muted-foreground">demo@example.com</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="w-5 h-5" />
            <span>Appearance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <label htmlFor="dark-mode-switch" className="flex items-center gap-2 cursor-pointer">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span>Dark Mode</span>
            </label>
            <Switch id="dark-mode-switch" checked={isDarkMode} onCheckedChange={onToggleDarkMode} />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-3">Color Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => onThemeChange(theme.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    currentTheme === theme.value 
                      ? 'border-primary shadow-md' 
                      : 'border-border hover:border-accent'
                  }`}
                >
                  <div
                    className="w-full h-8 rounded mb-2"
                    style={{ background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})` }}
                  ></div>
                  <span className="text-sm font-medium">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="w-5 h-5" />
            <span>About</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm">App Version</span>
            <span className="text-sm text-muted-foreground">1.0.0</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
