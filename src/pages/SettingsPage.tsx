
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Palette, Moon, Sun, User, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { useOutletContext } from "react-router-dom";
import { Profile } from "./Index";
import { themes } from "../config/themes";
import { PageHeader } from "../components/PageHeader";
import { AvatarUploader } from "../components/AvatarUploader";

interface OutletContextType {
  profile: Profile | null;
  onUpdateProfile: (updatedProfile: Partial<Profile>, avatarFile?: File) => Promise<void>;
  showGreeting: boolean;
  currentTheme?: string;
  onThemeChange: (theme: string) => void;
}

interface SettingsPageProps {
  onBack: () => void;
}

export const SettingsPage = ({ onBack }: SettingsPageProps) => {
  const { theme, setTheme } = useTheme();
  const { profile, onUpdateProfile, showGreeting, currentTheme = 'purple', onThemeChange } = useOutletContext<OutletContextType>();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [newName, setNewName] = useState(profile?.name || '');
  const selectedTheme = themes.find(t => t.value === currentTheme) || themes[0];

  const handleNameUpdate = async () => {
    if (newName.trim() && profile) {
      await onUpdateProfile({ name: newName.trim() });
      setEditProfileOpen(false);
    }
  };

  return (
    <div className="pb-6">
      <PageHeader
        title={
          <span 
            className="bg-gradient-to-r bg-clip-text text-transparent font-bold flex items-center gap-2 text-center w-full justify-center text-2xl md:text-3xl"
            style={{
              backgroundImage: `linear-gradient(135deg, ${selectedTheme.colors.primary}, ${selectedTheme.colors.secondary})`
            }}
          >
            <Settings className="w-6 h-6 md:w-7 md:h-7" style={{ color: selectedTheme.colors.primary }} />
            Settings
          </span>
        }
        onBack={onBack}
        profile={profile}
        onUpdateProfile={onUpdateProfile}
        showAvatar={!showGreeting}
      />

      <div className="space-y-6">
        {/* Profile Section */}
        <Card 
          className="backdrop-blur-sm border-0 shadow-lg"
          style={{ 
            background: `linear-gradient(135deg, ${selectedTheme.colors.primary}10, ${selectedTheme.colors.secondary}05)`
          }}
        >
          <CardHeader className="text-center">
            <CardTitle 
              className="text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent flex items-center justify-center gap-2"
              style={{
                backgroundImage: `linear-gradient(135deg, ${selectedTheme.colors.primary}, ${selectedTheme.colors.secondary})`
              }}
            >
              <User className="w-5 h-5" style={{ color: selectedTheme.colors.primary }} />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {profile && <AvatarUploader profile={profile} onUpdateProfile={onUpdateProfile} />}
            
            <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="transition-all duration-300 hover:scale-105"
                  style={{ 
                    borderColor: selectedTheme.colors.primary,
                    color: selectedTheme.colors.primary
                  }}
                >
                  Edit Name
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle 
                    className="bg-gradient-to-r bg-clip-text text-transparent font-bold"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${selectedTheme.colors.primary}, ${selectedTheme.colors.secondary})`
                    }}
                  >
                    Update Your Name
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter your name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="transition-all duration-300 focus:scale-105"
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleNameUpdate} 
                      className="flex-1 transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: selectedTheme.colors.primary }}
                    >
                      Update
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditProfileOpen(false)}
                      className="transition-all duration-300 hover:scale-105"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="backdrop-blur-sm border-0 shadow-lg bg-card/80">
          <CardHeader className="text-center">
            <CardTitle 
              className="text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent flex items-center justify-center gap-2"
              style={{
                backgroundImage: `linear-gradient(135deg, ${selectedTheme.colors.primary}, ${selectedTheme.colors.secondary})`
              }}
            >
              <Palette className="w-5 h-5" style={{ color: selectedTheme.colors.primary }} />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-base font-medium">Dark Mode</Label>
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Switch
                  id="dark-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
                <Moon className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Color Theme</Label>
              <Select value={currentTheme} onValueChange={onThemeChange}>
                <SelectTrigger 
                  className="transition-all duration-300 hover:scale-105"
                  style={{ borderColor: selectedTheme.colors.primary }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((themeOption) => (
                    <SelectItem key={themeOption.value} value={themeOption.value}>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ 
                            background: `linear-gradient(135deg, ${themeOption.colors.primary}, ${themeOption.colors.secondary})`
                          }}
                        />
                        <span>{themeOption.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
