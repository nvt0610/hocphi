import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-4 w-full max-w-[380px] pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: () => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(onRemove, 3000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const config = {
    success: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500',
      text: 'text-emerald-900',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    error: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      iconBg: 'bg-rose-500',
      text: 'text-rose-900',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
    info: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      iconBg: 'bg-indigo-500',
      text: 'text-indigo-900',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-500',
      text: 'text-amber-900',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    }
  };

  const { bg, border, iconBg, text, icon } = config[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`pointer-events-auto flex items-center gap-4 p-4 pr-6 ${bg} backdrop-blur-md border ${border} rounded-[20px] shadow-xl shadow-zinc-900/5 overflow-hidden`}
    >
      <div className={`${iconBg} w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-${toast.type}-500/20`}>
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className={`text-[13px] font-black uppercase tracking-widest opacity-40 ${text}`}>
          {toast.type}
        </span>
        <p className={`text-[14px] font-black leading-tight ${text}`}>
          {toast.message}
        </p>
      </div>
      <button 
        onClick={onRemove}
        className="ml-auto p-1.5 hover:bg-black/5 rounded-xl transition-colors opacity-30 hover:opacity-60"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
};

// No default export
