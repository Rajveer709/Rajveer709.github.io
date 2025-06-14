
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

interface HackDialogProps {
  onUnlock: () => void;
}

const HACK_CODE = "AlwaysHappy@12";

export const HackDialog = ({ onUnlock }: HackDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');

  const handleUnlockAttempt = () => {
    if (code === HACK_CODE) {
      onUnlock();
      setIsOpen(false);
      setCode('');
    } else {
      toast.error("Incorrect code. Try again!");
      setCode('');
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setCode('');
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-muted-foreground hover:text-primary !no-underline p-0 h-auto">
          ...
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unlock Everything</DialogTitle>
          <DialogDescription>
            Enter the secret code to unlock all themes and ranks. This is a one-way trip.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input 
            placeholder="Secret code..." 
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleUnlockAttempt(); }}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleUnlockAttempt}>Unlock</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
