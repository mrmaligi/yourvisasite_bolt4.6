import { type ReactNode, useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const modalContentRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      // Focus the modal content when opened for screen reader announcement
      requestAnimationFrame(() => {
        modalContentRef.current?.focus();
      });
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === overlayRef.current && onClose()}
        >
          <motion.div
            ref={modalContentRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            tabIndex={-1}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            className={`bg-white dark:bg-neutral-800 dark:text-neutral-100 w-full h-full sm:h-auto rounded-none sm:rounded-2xl shadow-elevated ${sizeClasses[size]} max-h-screen sm:max-h-[85vh] flex flex-col border-0 sm:border border-neutral-200/50 dark:border-neutral-700 outline-none`}
          >
            {title && (
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-neutral-100 dark:border-neutral-700 shrink-0">
                <h2 id={titleId} className="text-lg font-bold text-neutral-900 dark:text-white">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1 dark:text-neutral-200">{children}</div>
            {footer && (
              <div className="px-4 sm:px-6 py-4 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-end gap-3 bg-neutral-50/50 dark:bg-neutral-900/50 shrink-0 rounded-none sm:rounded-b-2xl">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
