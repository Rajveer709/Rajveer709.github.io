
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  onBack: () => void;
  className?: string;
}

export const PageHeader = ({ title, onBack, className }: PageHeaderProps) => {
  return (
    <div className={cn("flex items-center gap-4 mb-6", className)}>
      <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Back</span>
      </Button>
      <h1 className="text-2xl md:text-3xl font-bold text-primary truncate">{title}</h1>
    </div>
  );
};
