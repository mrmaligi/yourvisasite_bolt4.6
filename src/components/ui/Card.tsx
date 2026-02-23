import { type ReactNode, type KeyboardEvent } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  accent?: 'none' | 'left' | 'gold';
}

export function Card({ 
  children, 
  className = '', 
  hover = false, 
  onClick,
  accent = 'none'
}: CardProps) {
  const accentClasses = {
    none: '',
    left: 'border-l-4 border-l-navy-500',
    gold: 'border border-gold-400',
  };

  return (
    <div
      className={`bg-white border border-neutral-200 
        ${hover ? 'hover:border-navy-300 cursor-pointer' : ''} 
        ${accentClasses[accent]}
        transition-colors duration-200
        rounded
        ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e: KeyboardEvent) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 py-4 border-b border-neutral-200 bg-neutral-50/50 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 py-4 border-t border-neutral-200 bg-neutral-50/50 ${className}`}>{children}</div>;
}
