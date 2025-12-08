import React from 'react';

export default function Notification({ show, type = 'success', title, message, onClose }) {
  if (!show) return null;

  const colors = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  };

  return (
    <div className={`fixed top-[140px] left-0 right-0 z-40 ${colors[type]} px-6 py-3 text-center shadow-md`}>
      <p className="font-medium">{title}</p>
      {message && <p className="text-sm mt-1">{message}</p>}
    </div>
  );
}
