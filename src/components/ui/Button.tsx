import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useRipple, Ripple } from './Ripple';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
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
  children,
  disabled,
  className = '',
  onMouseDown,
  ...props
}: ButtonProps) {
  const { ripples, addRipple } = useRipple();

  return (
    <button
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
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
