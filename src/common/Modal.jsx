import React, { useEffect } from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

 
  if (!isOpen) return null;

  return (
    
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      
      <div
        className={`relative w-full max-w-lg bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col overflow-hidden text-gray-900 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          {title && (
            <h3 id="modal-title" className="text-lg font-semibold text-gray-800">
              {title}
            </h3>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="ml-auto text-gray-400 hover:text-gray-600 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            &#x2715;
          </button>
        </div>

        
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;