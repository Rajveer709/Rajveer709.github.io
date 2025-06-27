
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Profile } from '../pages/Index';
import { AvatarUploader } from './AvatarUploader';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string | ReactNode;
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
        "flex items-center gap-3 md:gap-4",
        showAvatar ? "justify-between mb-6 md:mb-8" : "mb-4 md:mb-6",
        className
      )}
    >
      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack} 
          className="shrink-0 hover:scale-110 transition-transform duration-200"
        >
          <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          <span className="sr-only">Back</span>
        </Button>
        {typeof title === 'string' ? (
          <h1 className="text-lg md:text-2xl font-bold text-primary truncate">{title}</h1>
        ) : (
          <h1 className="text-lg md:text-2xl truncate">{title}</h1>
        )}
      </div>
      {showAvatar && profile && onUpdateProfile && (
        <div className="flex items-center gap-4 animate-fade-in">
          <AvatarUploader profile={profile} onUpdateProfile={onUpdateProfile} />
        </div>
      )}
    </div>
  );
};
