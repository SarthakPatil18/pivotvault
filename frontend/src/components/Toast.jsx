import React, { createContext, useContext, useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ title, type = 'info', duration = 4000 }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded shadow"
          >
            <span className="text-sm">{t.title}</span>
            <button onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
