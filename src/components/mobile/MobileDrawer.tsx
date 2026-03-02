import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  side?: 'left' | 'right' | 'bottom';
}

export function MobileDrawer({ isOpen, onClose, children, title, side = 'bottom' }: MobileDrawerProps) {
  const variants = {
    hidden: {
      x: side === 'left' ? '-100%' : side === 'right' ? '100%' : 0,
      y: side === 'bottom' ? '100%' : 0,
      opacity: 0
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1
    },
    exit: {
      x: side === 'left' ? '-100%' : side === 'right' ? '100%' : 0,
      y: side === 'bottom' ? '100%' : 0,
      opacity: 0
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
          />
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed z-50 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto
              ${side === 'bottom' ? 'bottom-0 left-0 right-0 rounded-t-2xl max-h-[85vh]' : ''}
              ${side === 'left' ? 'top-0 left-0 bottom-0 w-3/4 max-w-sm' : ''}
              ${side === 'right' ? 'top-0 right-0 bottom-0 w-3/4 max-w-sm' : ''}
            `}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold">{title}</h2>
              <Button variant="ghost" size="sm" onClick={onClose} className="p-1 h-auto">
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="p-4 pb-safe">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
