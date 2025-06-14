
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';

interface SettingsDialogProps {
  onThemeChange: (theme: string) => void;
  currentTheme: string;
}

const themes = [
  { name: 'Purple', value: 'purple', gradient: 'bg-gradient-purple', colors: { primary: '#667eea', secondary: '#764ba2' } },
  { name: 'Teal', value: 'teal', gradient: 'bg-gradient-teal', colors: { primary: '#11998e', secondary: '#38ef7d' } },
  { name: 'Orange', value: 'orange', gradient: 'bg-gradient-orange', colors: { primary: '#fc4a1a', secondary: '#f7b733' } },
  { name: 'Pink', value: 'pink', gradient: 'bg-gradient-pink', colors: { primary: '#ff9a9e', secondary: '#fecfef' } },
  { name: 'Blue', value: 'blue', gradient: 'bg-gradient-success', colors: { primary: '#4facfe', secondary: '#00f2fe' } },
  { name: 'Green', value: 'green', gradient: 'bg-gradient-warning', colors: { primary: '#43e97b', secondary: '#38f9d7' } }
];

export const SettingsDialog = ({ onThemeChange, currentTheme }: SettingsDialogProps) => {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirmTheme = () => {
    onThemeChange(selectedTheme);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Theme Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-3">Choose Color Theme</h3>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => setSelectedTheme(theme.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedTheme === theme.value 
                      ? 'border-blue-500 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-full h-8 rounded ${theme.gradient} mb-2`}></div>
                  <span className="text-sm font-medium">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmTheme}>
              Apply Theme
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
