import React from 'react';

export default function Modal({ title, children, onClose, footer }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-auto my-8 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg z-10">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-4">{children}</div>

        {footer && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
