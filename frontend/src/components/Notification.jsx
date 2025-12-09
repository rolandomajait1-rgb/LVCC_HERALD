import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Notification({ show, type = 'success', title, message, onClose, autoClose = true, duration = 5000 }) {
  useEffect(() => {
    if (show && autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, duration, onClose]);

  if (!show) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full mx-4 rounded-lg shadow-lg border-l-4 ${
      type === 'success' ? 'bg-green-50 border-green-400 text-green-800' : 
      type === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
      type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
      'bg-blue-50 border-blue-400 text-blue-800'
    }`}>
      <div className="flex items-start p-4">
        <div className="flex-1">
          <p className="font-semibold">{title}</p>
          {message && <p className="text-sm mt-1">{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
