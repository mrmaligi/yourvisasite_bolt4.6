import { useState, createContext, useContext } from 'react';

interface TabsContextType {
  value: string;
  onChange: (value: string) => void;
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
  
  const currentValue = value ?? internalValue;
  const handleChange = onValueChange ?? setInternalValue;

  return (
    <TabsContext.Provider value={{ value: currentValue, onChange: handleChange }}>
      {children}
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`inline-flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl ${className}`}>
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
  const { value: selectedValue, onChange } = useTabs();
  const isSelected = selectedValue === value;

  return (
    <button
      onClick={() => value && onChange(value)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
  const { value: selectedValue } = useTabs();
  
  if (value !== selectedValue) return null;

  return (
    <div className={className}>
      {children}
    </div>
  );
}
