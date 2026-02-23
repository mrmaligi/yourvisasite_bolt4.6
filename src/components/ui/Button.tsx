import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  to?: string;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-4 py-2 min-h-[40px]',
  md: 'text-sm px-6 py-3 min-h-[48px]',
  lg: 'text-base px-8 py-4 min-h-[56px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  to,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const commonClasses = `${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (to) {
    return (
      <Link
        to={to}
        className={`${commonClasses} inline-flex items-center justify-center`}
        {...(props as any)}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        {children}
      </Link>
    );
  }

  return (
    <button
      className={commonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
      {children}
    </button>
  );
}
