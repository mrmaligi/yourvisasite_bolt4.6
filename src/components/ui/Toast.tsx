import { useState, useCallback, type ReactNode } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { ToastContext, type ToastType } from '../../contexts/ToastContext';

export { useToast } from '../../contexts/ToastContext';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] space-y-2 max-w-sm w-full px-4 sm:px-0 pointer-events-none flex flex-col items-end">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const colors: Record<ToastType, string> = {
  success: 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-100 dark:border-emerald-600',
  error: 'border-red-500 bg-red-50 text-red-800 dark:bg-red-950/90 dark:text-red-100 dark:border-red-600',
  info: 'border-sky-500 bg-sky-50 text-sky-800 dark:bg-sky-950/90 dark:text-sky-100 dark:border-sky-600',
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const Icon = icons[toast.type];
  return (
    <div className={`pointer-events-auto w-full flex items-start gap-3 px-4 py-3 rounded-lg border-l-4 shadow-lg animate-slide-in-right backdrop-blur-sm ${colors[toast.type]}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm flex-1 font-medium">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
