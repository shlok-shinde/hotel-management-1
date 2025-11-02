import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ children, onClose, title }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col">
      <div className="flex justify-between items-center p-6 border-b">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  </div>
);

export default Modal;
