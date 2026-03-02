import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AlertProps {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = 'default', children, className = '' }: AlertProps) {
  const variantStyles = {
    default: 'bg-neutral-100 text-neutral-900',
    destructive: 'bg-red-50 text-red-900 border-red-200',
    success: 'bg-green-50 text-green-900 border-green-200',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200'
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div className={`flex p-4 rounded-lg border ${style} ${className}`} role="alert">
      <AlertCircle className="h-5 w-5 mr-3 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function AlertDescription({ children }: { children: React.ReactNode }) {
  return <div className="text-sm">{children}</div>;
}
