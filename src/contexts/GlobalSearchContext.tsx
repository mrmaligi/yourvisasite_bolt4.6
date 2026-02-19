import React, { createContext, useContext, useEffect, useState } from 'react';

interface GlobalSearchContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
}

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

export function GlobalSearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <GlobalSearchContext.Provider value={{ isOpen, setIsOpen, toggle }}>
      {children}
    </GlobalSearchContext.Provider>
  );
}

export function useGlobalSearch() {
  const context = useContext(GlobalSearchContext);
  if (context === undefined) {
    throw new Error('useGlobalSearch must be used within a GlobalSearchProvider');
  }
  return context;
}
