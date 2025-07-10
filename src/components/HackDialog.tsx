import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Heart, Calculator, Atom, Users, Smile, Palette, BookOpen, KeyRound, Star } from 'lucide-react';

interface HackDialogProps {
  onUnlock: (type: string) => void;
  buttonTitle?: string;
  buttonGradient?: string;
  cheatType?: string;
}

const CHEAT_CODES = [
  {
    codes: ['dreamcatcher', 'royal pink'],
    message: '', // Will be set dynamically
    icon: Star,
    color: 'text-pink-500',
    type: 'royal-pink',
  },
  {
    codes: ['TJsir', 'Ajaysir'],
    message: 'Physics Rocks',
    icon: Atom,
    color: 'text-blue-500',
    type: 'physics',
  },
  {
    codes: ['Paulsir'],
    message: 'math is a way of life',
    icon: Calculator,
    color: 'text-green-500',
    type: 'math',
  },
  {
    codes: ['Satanisir'],
    message: 'mathematics has taught me the importance of patience',
    icon: BookOpen,
    color: 'text-yellow-500',
    type: 'math',
  },
  {
    codes: ['Mamma'],
    message: 'Hi, Ma',
    icon: Heart,
    color: 'text-red-500',
    type: 'love',
  },
  {
    codes: ['Avi', 'Dhruv'],
    message: 'Love you, bhai!',
    icon: Heart,
    color: 'text-pink-500',
    type: 'love',
  },
  {
    codes: ['Rashi'],
    message: 'Hi Bestie',
    icon: Users,
    color: 'text-purple-500',
    type: 'friends',
  },
  {
    codes: ['Rajveer709'],
    message: 'Cheat Codes:\n- TJsir/Ajaysir: Physics Rocks\n- Paulsir: math is a way of life\n- Satanisir: mathematics has taught me the importance of patience\n- Mamma: Hi, Ma\n- Avi/Dhruv: Love you, bhai!\n- Rashi: Hi Bestie\n- colors: Unlock all themes (except Avi/Gold)',
    icon: KeyRound,
    color: 'text-orange-500',
    type: 'showAll',
  },
  {
    codes: ['colors'],
    message: 'All themes unlocked (except Avi/Gold)!',
    icon: Palette,
    color: 'text-emerald-500',
    type: 'colors',
  },
  // Default fallback
  {
    codes: ['AlwaysHappy@12'],
    message: 'Cheats activated! Everything unlocked.',
    icon: Star,
    color: 'text-yellow-400',
    type: 'unlockAll',
  },
];


export const HackDialog = ({ onUnlock, buttonTitle = 'cheat code', buttonGradient = '', cheatType }: HackDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [cheat, setCheat] = useState<any>(null);

  const handleUnlockAttempt = () => {
    let found;
    if (cheatType) {
      found = CHEAT_CODES.find(entry => entry.type === cheatType);
    } else {
      found = CHEAT_CODES.find(entry => entry.codes.some(c => c.toLowerCase() === code.trim().toLowerCase()));
    }
    if (found) {
      // Special message for dreamcatcher/royal pink
      if (found.type === 'royal-pink') {
        const username = (window.localStorage.getItem('profileName') || '').split(' ')[0] || 'User';
        found.message = `Your app has been aesthetic, ${username}!\nEnjoy the Royal Pink theme ✨`;
      }
      setCheat(found);

      // Unlock logic for localStorage
      if (found.type === 'unlockAll' || found.type === 'showAll') {
        // Only "AlwaysHappy@12" and "Rajveer709" unlock Gold/Avi
        window.localStorage.setItem('cheatUnlockType', 'gold-avi');
      } else if (found.type === 'royal-pink' || found.type === 'colors' || found.type === 'physics' || found.type === 'math' || found.type === 'love' || found.type === 'friends') {
        // All other codes only unlock Royal Pink and Royal Blue
        window.localStorage.setItem('cheatUnlockType', 'royal');
      }

      onUnlock(found.type);
      setCode('');
    } else {
      toast.error('Incorrect code. Try again!');
      setCode('');
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    setCode('');
    setCheat(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`text-[10px] px-2 py-1 h-5 min-h-0 min-w-0 leading-none rounded-full font-bold ${buttonGradient}`}
          style={buttonGradient ? { backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent', backgroundImage: undefined } : {}}
        >
          {buttonTitle}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center">
        <DialogHeader>
          <DialogTitle>{buttonTitle}</DialogTitle>
          <DialogDescription>
            {cheatType === 'colors'
              ? 'Unlock all color themes (except Avi/Gold)!'
              : cheatType === 'unlockAll' || buttonTitle.toLowerCase().includes('rank')
                ? 'Unlock the highest rank (Avi) and all features!'
                : 'Enter a secret code to unlock themes, ranks, or see a surprise!'}
          </DialogDescription>
          {/* Account Deletion Google Docs link below Privacy Policy */}
          <div className="mt-2 text-xs text-center">
            <a
              href="https://docs.google.com/document/d/e/2PACX-1vQSkdjzUKcE0dFSsmWMI42JALnKbSHK2bNYsMtQWjFzFYLD96uPZQYS__XGQb8CCwiK3vIifo1jsKVJ/pub"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary hover:text-primary/80 transition-colors block mt-2"
            >
              Account Deletion (Google Docs)
            </a>
          </div>
        </DialogHeader>
        {!cheat ? (
          !cheatType ? (
            <div className="py-4 w-full flex flex-col items-center">
              <Input
                placeholder="Secret code..."
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleUnlockAttempt(); }}
                className="mb-2"
              />
              <Button onClick={handleUnlockAttempt} className="w-full">Unlock</Button>
            </div>
          ) : (
            <Button onClick={handleUnlockAttempt} className="w-full mt-4">Unlock Instantly</Button>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <cheat.icon className={`w-16 h-16 mb-4 ${cheat.color} animate-bounce`} />
            <div className={`text-2xl font-bold text-center whitespace-pre-line ${cheat.color}`}>{cheat.message}</div>
            <Button onClick={() => setIsOpen(false)} className="mt-6">Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
