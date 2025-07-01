
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Profile } from '../pages/Index';
import { AvatarUploader } from './AvatarUploader';

interface PageHeaderProps {
  title: string;
  onBack: () => void;
  className?: string;
  profile?: Profile | null;
  onUpdateProfile?: (updatedProfile: Partial<Profile>, avatarFile?: File) => Promise<void>;
  showAvatar?: boolean;
}

export const PageHeader = ({ title, onBack, className, profile, onUpdateProfile, showAvatar }: PageHeaderProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4",
        showAvatar ? "justify-between mb-8" : "mb-4",
        className
      )}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-xl md:text-2xl font-bold text-primary truncate">{title}</h1>
      </div>
      {showAvatar && profile && onUpdateProfile && (
        <div className="flex items-center gap-4 animate-fade-in">
          <AvatarUploader profile={profile} onUpdateProfile={onUpdateProfile} />
        </div>
      )}
    </div>
  );
};
