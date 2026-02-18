import { type ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className={`bg-white dark:bg-neutral-800 rounded-2xl shadow-elevated w-full ${sizeClasses[size]} max-h-[85vh] flex flex-col animate-scale-in border border-neutral-200/50 dark:border-neutral-700`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-700">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="px-6 py-5 overflow-y-auto flex-1 dark:text-neutral-200">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-end gap-3 bg-neutral-50/50 dark:bg-neutral-900/50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
