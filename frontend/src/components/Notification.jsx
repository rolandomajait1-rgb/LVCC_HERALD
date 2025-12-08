import React from 'react';

export default function Notification({ show, type = 'success', title, message, onClose }) {
  if (!show) return null;

  return (
    <div className={`w-full px-6 py-3 text-left ${
      type === 'success' ? 'bg-green-200 text-green-800' : 
      type === 'error' ? 'bg-red-200 text-red-800' :
      type === 'warning' ? 'bg-yellow-200 text-yellow-800' :
      'bg-blue-200 text-blue-800'
    }`}>
      <p className="italic">{title}</p>
      {message && <p className="text-sm mt-1 italic">{message}</p>}
    </div>
  );
}
