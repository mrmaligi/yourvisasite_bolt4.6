import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FavoriteButtonProps {
  isSaved: boolean;
  onToggle: () => Promise<void>;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({ isSaved, onToggle, className = '', size = 'md' }: FavoriteButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  const padding = size === 'sm' ? 'p-1.5' : size === 'lg' ? 'p-3' : 'p-2';

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // If not logged in, redirect to login page
      // We could also show a toast here, but redirect is standard
      navigate('/login');
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      await onToggle();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${padding} rounded-full transition-colors ${
        isSaved
          ? 'text-red-500 bg-red-50 hover:bg-red-100'
          : 'text-neutral-400 hover:text-red-500 hover:bg-neutral-100'
      } ${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isSaved ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`${iconSize} ${isSaved ? 'fill-current' : ''}`} />
    </button>
  );
}
