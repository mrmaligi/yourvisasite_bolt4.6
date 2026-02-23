import { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, forwardRef, useId } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-neutral-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={
            [
              error ? errorId : undefined,
              helperText && !error ? helperId : undefined
            ].filter(Boolean).join(' ') || undefined
          }
          className={`w-full px-4 py-3 border bg-white text-neutral-900
            placeholder:text-neutral-400
            focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500
            hover:border-neutral-400
            transition-colors duration-150
            min-h-[48px]
            rounded
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-neutral-300'} 
            ${className}`}
          {...props}
        />
        {error && <p id={errorId} className="text-sm text-red-600">{error}</p>}
        {helperText && !error && <p id={helperId} className="text-sm text-neutral-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-neutral-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full px-4 py-3 border bg-white text-neutral-900
            placeholder:text-neutral-400
            focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500
            hover:border-neutral-400
            transition-colors duration-150
            min-h-[120px]
            rounded
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-neutral-300'} 
            ${className}`}
          {...props}
        />
        {error && <p id={errorId} className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-neutral-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full px-4 py-3 border bg-white text-neutral-900
            focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500
            hover:border-neutral-400
            transition-colors duration-150
            min-h-[48px]
            rounded
            ${error ? 'border-red-500' : 'border-neutral-300'} 
            ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p id={errorId} className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
