import { type ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'premium';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-neutral-100 text-neutral-700 ring-neutral-200/50',
  primary: 'bg-primary-50 text-primary-800 ring-primary-200/50',
  success: 'bg-emerald-50 text-emerald-800 ring-emerald-200/50',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200/50',
  danger: 'bg-red-50 text-red-800 ring-red-200/50',
  info: 'bg-sky-50 text-sky-800 ring-sky-200/50',
  premium: 'bg-accent-50 text-accent-800 ring-accent-200/50',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ring-1 ring-inset ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
