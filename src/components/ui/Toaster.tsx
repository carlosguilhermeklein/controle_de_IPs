import React from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useNetwork();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start p-4 rounded-lg shadow-lg text-white transform transition-all duration-300 ease-in-out translate-y-0 opacity-100 ${
            toast.type === 'success' ? 'bg-green-600 dark:bg-green-700' :
            toast.type === 'error' ? 'bg-red-600 dark:bg-red-700' :
            toast.type === 'warning' ? 'bg-amber-600 dark:bg-amber-700' : 'bg-blue-600 dark:bg-blue-700'
          }`}
        >
          <div className="flex-shrink-0 mr-3">
            {toast.type === 'success' && <CheckCircle className="h-5 w-5" />}
            {toast.type === 'error' && <AlertCircle className="h-5 w-5" />}
            {toast.type === 'warning' && <AlertTriangle className="h-5 w-5" />}
            {toast.type === 'info' && <Info className="h-5 w-5" />}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{toast.title}</h3>
            {toast.description && <p className="text-sm mt-1 opacity-90">{toast.description}</p>}
          </div>
          <button 
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-white opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
};