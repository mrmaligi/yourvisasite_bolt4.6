import { Bookmark } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SaveVisaButtonProps {
  visaId: string;
  isSaved: boolean;
  onToggle: (visaId: string) => Promise<boolean>;
  size?: 'sm' | 'md';
  className?: string;
}

export function SaveVisaButton({ visaId, isSaved, onToggle, size = 'sm', className = '' }: SaveVisaButtonProps) {
  const { user } = useAuth();

  if (!user) return null;

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const padding = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(visaId);
      }}
      className={`${padding} min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors ${
        isSaved
          ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
          : 'text-neutral-400 hover:text-primary-600 hover:bg-neutral-50'
      } ${className}`}
      title={isSaved ? 'Remove from saved' : 'Save visa'}
      aria-label={isSaved ? 'Remove from saved visas' : 'Save visa for later'}
    >
      <Bookmark className={`${iconSize} ${isSaved ? 'fill-current' : ''}`} />
    </button>
  );
}
