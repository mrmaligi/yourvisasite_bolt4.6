import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useGlobalSearch } from '../../contexts/GlobalSearchContext';

interface SearchTriggerProps {
  className?: string;
  variant?: 'icon' | 'full';
  inputClassName?: string;
}

export function SearchTrigger({ className = '', variant = 'full', inputClassName = '' }: SearchTriggerProps) {
  const { toggle } = useGlobalSearch();
  const [shortcut, setShortcut] = useState('Ctrl+K');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      setShortcut(isMac ? '⌘K' : 'Ctrl+K');
    }
  }, []);

  if (variant === 'icon') {
    return (
      <button
        onClick={toggle}
        className={`p-2 hover:bg-navy-700 transition-colors ${className}`}
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>
    );
  }

  const defaultInputClass = `relative w-full flex items-center gap-2 px-3 py-2 bg-navy-700 border border-navy-600 hover:border-gold-500 text-sm text-navy-200 transition-all duration-200 ${inputClassName}`;

  return (
    <button
      onClick={toggle}
      className={`${defaultInputClass} ${className}`}
    >
      <Search className="w-4 h-4 text-navy-300" />
      <span className="flex-1 text-left">Search...</span>
      <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-navy-300 bg-navy-600 border border-navy-500">
        {shortcut}
      </kbd>
    </button>
  );
}
