import { type InputHTMLAttributes, forwardRef, useId } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={`
            w-4 h-4 text-primary-600 bg-white border-neutral-300 rounded
            focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-neutral-800
            focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600
            ${className}
          `}
          {...props}
        />
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-700 dark:text-neutral-300 select-none cursor-pointer">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
