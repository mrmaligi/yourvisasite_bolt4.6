import { type ReactNode } from 'react';
import { useRipple, Ripple } from './Ripple';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const { ripples, addRipple } = useRipple();
  const isInteractive = !!onClick;

  return (
    <div
      className={`${hover ? 'card-hover cursor-pointer' : 'card'} ${
        isInteractive
          ? 'active:scale-[0.98] transition-transform duration-200 min-h-[44px] relative overflow-hidden'
          : ''
      } ${className}`}
      onClick={(e) => {
        if (onClick) {
          addRipple(e);
          onClick();
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
      {isInteractive && <Ripple ripples={ripples} />}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 rounded-b-2xl dark:border-neutral-800 dark:bg-neutral-800/50 ${className}`}>{children}</div>;
}
