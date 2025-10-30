import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
  timeoutMs?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const timeoutMs = toast.timeoutMs ?? 4000;
    const next: Toast = { id, type: 'info', ...toast, timeoutMs };
    setToasts((prev) => [next, ...prev]);
    if (timeoutMs > 0) {
      setTimeout(() => remove(id), timeoutMs);
    }
  }, [remove]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast UI */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              'w-80 max-w-[90vw] rounded-md shadow-lg border px-4 py-3 bg-white flex items-start gap-3 animate-slide-up transition-all ' +
              (t.type === 'success'
                ? 'border-green-300'
                : t.type === 'warning'
                ? 'border-yellow-300'
                : t.type === 'error'
                ? 'border-red-300'
                : 'border-gray-200')
            }
            role="status"
            aria-live="polite"
          >
            <div className="mt-0.5">
              {t.type === 'success' && <span aria-hidden>✅</span>}
              {t.type === 'warning' && <span aria-hidden>⚠️</span>}
              {t.type === 'error' && <span aria-hidden>❌</span>}
              {(!t.type || t.type === 'info') && <span aria-hidden>🔔</span>}
            </div>
            <div className="flex-1 min-w-0">
              {t.title && <div className="font-medium text-gray-900 truncate">{t.title}</div>}
              <div className="text-sm text-gray-700 break-words">{t.message}</div>
            </div>
            <button
              onClick={() => remove(t.id)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};


