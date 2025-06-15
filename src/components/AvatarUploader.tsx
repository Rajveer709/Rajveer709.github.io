
import { useState, ChangeEvent } from 'react';
import { Profile } from '../pages/Index';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Camera } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarUploaderProps {
  profile: Profile | null;
  onUpdateProfile: (updatedProfile: Partial<Profile>, avatarFile?: File) => Promise<void>;
}

export const AvatarUploader = ({ profile, onUpdateProfile }: AvatarUploaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile?.avatar_url || null);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    const updatedProfile: Partial<Profile> = {};
    if (name !== profile.name) {
      updatedProfile.name = name;
    }

    if (!avatarFile && !updatedProfile.name) {
      toast.info("No changes to save.");
      setIsOpen(false);
      return;
    }
    
    await onUpdateProfile(updatedProfile, avatarFile);
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="relative group">
          <Avatar className="h-10 w-10 border-2 border-primary/50 group-hover:border-primary transition-all">
            <AvatarImage src={previewUrl || profile?.avatar_url || ''} alt={profile?.name || ''} />
            <AvatarFallback className="bg-primary/20 text-primary font-bold">
                {getInitials(profile?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-5 h-5 text-white" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={previewUrl || profile?.avatar_url || ''} alt={profile?.name || ''} />
                <AvatarFallback className="bg-primary/20 text-primary font-bold text-3xl">
                  {getInitials(profile?.name)}
                </AvatarFallback>
              </Avatar>
              <Label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90">
                <Camera className="w-4 h-4" />
              </Label>
              <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile?.email || ''} readOnly disabled />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
