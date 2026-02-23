import React, { forwardRef, InputHTMLAttributes } from 'react';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface MobileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';

    return (
      <div className="space-y-2 mb-4">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          <Input
            ref={ref}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            className={cn(
              "h-12 px-4 rounded-xl text-base bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all",
              error && "border-red-500 focus:ring-red-500",
              icon && "pl-11",
              isPassword && "pr-11",
              className
            )}
            {...props}
          />
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-2"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-500 ml-1">{error}</p>}
      </div>
    );
  }
);

MobileInput.displayName = 'MobileInput';
