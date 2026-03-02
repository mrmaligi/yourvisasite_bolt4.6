import { type ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'premium';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-neutral-100 text-neutral-700 ring-neutral-200/50 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700',
  primary: 'bg-primary-50 text-primary-800 ring-primary-200/50 dark:bg-primary-900/30 dark:text-primary-300 dark:ring-primary-800',
  secondary: 'bg-neutral-200 text-neutral-800 ring-neutral-300/50 dark:bg-neutral-700 dark:text-neutral-200 dark:ring-neutral-600',
  success: 'bg-emerald-50 text-emerald-800 ring-emerald-200/50 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200/50 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-800',
  danger: 'bg-red-50 text-red-800 ring-red-200/50 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-800',
  info: 'bg-sky-50 text-sky-800 ring-sky-200/50 dark:bg-sky-900/30 dark:text-sky-300 dark:ring-sky-800',
  premium: 'bg-accent-50 text-accent-800 ring-accent-200/50 dark:bg-accent-900/30 dark:text-accent-300 dark:ring-accent-800',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ring-1 ring-inset transition-colors duration-200 ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
