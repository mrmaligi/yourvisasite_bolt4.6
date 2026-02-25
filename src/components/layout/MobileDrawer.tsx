import React, { useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  side?: 'left' | 'right';
  title?: ReactNode;
}

export function MobileDrawer({ isOpen, onClose, children, className = '', side = 'right', title = 'Menu' }: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

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

  // Swipe logic
  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  }

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    // If drawer is on the right, swiping right (towards edge) should close it.
    // Swipe right means end > start, so distance (start - end) is negative.
    if (side === 'right' && isRightSwipe) {
      onClose();
    }

    // If drawer is on the left, swiping left (towards edge) should close it.
    // Swipe left means end < start, so distance (start - end) is positive.
    if (side === 'left' && isLeftSwipe) {
      onClose();
    }
  }

  if (typeof document === 'undefined') return null;

  const sideClasses = side === 'left'
    ? 'left-0 ' + (isOpen ? 'translate-x-0' : '-translate-x-full')
    : 'right-0 ' + (isOpen ? 'translate-x-0' : 'translate-x-full');

  const containerJustify = side === 'left' ? 'justify-start' : 'justify-end';

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex ${containerJustify} transition-all duration-300 ${
        isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`relative w-4/5 max-w-[300px] h-full bg-white dark:bg-neutral-900 shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${sideClasses} ${className}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
          {typeof title === 'string' ? (
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{title}</h2>
          ) : (
            title
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
