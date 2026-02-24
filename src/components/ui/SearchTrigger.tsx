import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useGlobalSearch } from '../../contexts/GlobalSearchContext';

interface SearchTriggerProps {
  className?: string;
  variant?: 'icon' | 'full';
}

export function SearchTrigger({ className = '', variant = 'full' }: SearchTriggerProps) {
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
        className={`p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 ${className}`}
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className={`relative w-full md:w-64 lg:w-72 flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-800/50 hover:bg-neutral-200/80 dark:hover:bg-neutral-800 border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 rounded-xl text-sm text-neutral-500 dark:text-neutral-400 transition-all duration-200 group ${className}`}
    >
      <Search className="w-4 h-4" />
      <span className="flex-1 text-left">Search...</span>
      <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-500 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded shadow-sm group-hover:border-neutral-300 dark:group-hover:border-neutral-600 transition-colors">
        {shortcut}
      </kbd>
    </button>
  );
}
