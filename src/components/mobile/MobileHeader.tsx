import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  action?: React.ReactNode;
}

export function MobileHeader({ title, showBack, action }: MobileHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto -ml-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </Button>
        )}
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
          {title || 'VisaBuild'}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {action}
      </div>
    </header>
  );
}
