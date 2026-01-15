
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div 
      className={`fixed bottom-24 right-6 z-50 transform transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90 pointer-events-none'
      }`}
    >
      <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
        <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
          <i className="fa-solid fa-check text-[10px]"></i>
        </div>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
