import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary' | 'danger';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', loading = false, children, disabled, ...props }, ref) => {

    // Map variants to our design system classes
    const variantClasses = {
      default: 'btn-primary', // Green primary from index.css
      primary: 'btn-primary',
      destructive: 'btn-danger', // Red from index.css
      danger: 'btn-danger',
      outline: 'btn-secondary', // White with border from index.css
      secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border-none shadow-sm', // Grey background (solid secondary)
      ghost: 'btn-ghost', // Transparent from index.css
      link: 'text-primary-600 underline-offset-4 hover:underline p-0 h-auto bg-transparent shadow-none',
    };

    // Override sizes only if not default (btn-* classes handle default size)
    const sizeClasses = {
      default: '', // Let btn-* handle it (usually px-5 py-2.5)
      sm: 'h-9 px-3 text-xs',
      lg: 'h-11 px-8 text-base',
      icon: 'h-10 w-10 p-0 flex items-center justify-center',
    };

    const variantClass = variantClasses[variant] || variantClasses.default;
    const sizeClass = sizeClasses[size] || sizeClasses.default;

    const combinedClassName = [
      'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
      variantClass,
      sizeClass,
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        className={combinedClassName}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
