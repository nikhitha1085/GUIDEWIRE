import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl transition-all"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative glass-panel rounded-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 opacity-100 shadow-2xl shadow-cyan-500/10">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white tracking-wide">{title}</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="text-slate-200">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
