import { useState, createContext, useContext, useId, useRef } from 'react';

interface TabsContextType {
  value: string;
  onChange: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Tabs({ defaultValue, value, onValueChange, children }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const baseId = useId();
  
  const currentValue = value ?? internalValue;
  const handleChange = onValueChange ?? setInternalValue;

  return (
    <TabsContext.Provider value={{ value: currentValue, onChange: handleChange, baseId }}>
      {children}
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className = '' }: TabsListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!listRef.current) return;

    const tabs = Array.from(listRef.current.querySelectorAll('[role="tab"]')) as HTMLElement[];
    if (tabs.length === 0) return;

    const currentIndex = tabs.findIndex(tab => tab === document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % tabs.length;
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      e.preventDefault();
    } else if (e.key === 'Home') {
      nextIndex = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1;
      e.preventDefault();
    }

    if (nextIndex !== currentIndex) {
      tabs[nextIndex].focus();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      onKeyDown={handleKeyDown}
      className={`inline-flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl ${className}`}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value?: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className = '' }: TabsTriggerProps) {
  const { value: selectedValue, onChange, baseId } = useTabs();
  const isSelected = selectedValue === value;

  const id = `${baseId}-tab-${value}`;
  const controlsId = `${baseId}-panel-${value}`;

  return (
    <button
      role="tab"
      id={id}
      aria-selected={isSelected}
      aria-controls={controlsId}
      tabIndex={isSelected ? 0 : -1}
      onClick={() => value && onChange(value)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
        isSelected
          ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
      } ${className}`}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className = '' }: TabsContentProps) {
  const { value: selectedValue, baseId } = useTabs();
  
  if (value !== selectedValue) return null;

  const id = `${baseId}-panel-${value}`;
  const labelledById = `${baseId}-tab-${value}`;

  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={labelledById}
      tabIndex={0}
      className={className}
    >
      {children}
    </div>
  );
}
