import { type ReactNode } from 'react';

export type BadgeVariant = 'default' | 'navy' | 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'premium';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  navy: 'bg-navy-50 text-navy-700 border-navy-200',
  gold: 'bg-gold-50 text-gold-700 border-gold-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
  premium: 'bg-gold-100 text-gold-800 border-gold-300',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold uppercase tracking-wider border rounded ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
