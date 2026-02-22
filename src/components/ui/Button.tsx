
import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRipple, Ripple } from './Ripple';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  to?: string;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3 py-2 min-h-[44px] sm:min-h-[36px]',
  md: 'text-sm px-5 py-3 min-h-[44px]',
  lg: 'text-base px-6 py-3 min-h-[48px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  to,
  children,
  disabled,
  className = '',
  onMouseDown,
  ...props
}: ButtonProps) {
  const { ripples, addRipple } = useRipple();
  const commonClasses = `${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (to) {
    return (
      <Link
        to={to}
        className={`${commonClasses} inline-flex items-center justify-center`}
        onMouseDown={(e) => {
          if (!disabled && !loading) {
            addRipple(e);
          }
          onMouseDown?.(e as any);
        }}
        {...(props as any)}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        {children}
        <Ripple ripples={ripples} />
      </Link>
    );
  }

  return (
    <button
      className={commonClasses}
      disabled={disabled || loading}
      onMouseDown={(e) => {
        if (!disabled && !loading) {
          addRipple(e);
        }
        onMouseDown?.(e);
      }}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
      <Ripple ripples={ripples} />
    </button>
  );
}
