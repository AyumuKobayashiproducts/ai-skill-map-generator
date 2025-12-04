"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ 
  toasts, 
  removeToast 
}: { 
  toasts: Toast[]; 
  removeToast: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ 
  toast, 
  onClose 
}: { 
  toast: Toast; 
  onClose: () => void;
}) {
  const config = {
    success: {
      bg: "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200",
      icon: "✅",
      text: "text-emerald-700"
    },
    error: {
      bg: "bg-gradient-to-r from-red-50 to-rose-50 border-red-200",
      icon: "❌",
      text: "text-red-700"
    },
    info: {
      bg: "bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200",
      icon: "ℹ️",
      text: "text-sky-700"
    }
  };

  const { bg, icon, text } = config[toast.type];

  return (
    <div 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${bg} animate-slide-in-right min-w-[280px] max-w-[400px]`}
      role="alert"
    >
      <span className="text-lg flex-shrink-0">{icon}</span>
      <p className={`text-sm font-medium flex-1 ${text}`}>{toast.message}</p>
      <button
        type="button"
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
      >
        ✕
      </button>
    </div>
  );
}


