import { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
  direction?: 'up' | 'none';
  fullWidth?: boolean;
}

export function FadeIn({
  children,
  duration = 0.5,
  delay = 0,
  className = '',
  direction = 'up',
  fullWidth = false
}: FadeInProps) {
  return (
    <div
      className={`${className} ${fullWidth ? 'w-full' : ''}`}
      style={{
        opacity: 0, // Start invisible
        animation: `${direction === 'up' ? 'fadeInUp' : 'fadeIn'} ${duration}s ease-out forwards`,
        animationDelay: `${delay}s`
      }}
    >
      {children}
    </div>
  );
}
