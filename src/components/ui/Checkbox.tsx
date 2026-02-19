import { type InputHTMLAttributes, forwardRef, useId } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="flex items-start gap-2">
        <div className="relative flex items-center mt-0.5">
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            className={`peer h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-sm border border-neutral-300 transition-all checked:bg-primary-600 checked:border-primary-600 hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:checked:bg-primary-600 dark:checked:border-primary-600 ${className}`}
            {...props}
          />
          <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
        </div>
        {label && (
          <label htmlFor={inputId} className="cursor-pointer select-none text-sm text-neutral-700 dark:text-neutral-300">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
