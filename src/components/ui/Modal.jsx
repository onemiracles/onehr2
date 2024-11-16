import { forwardRef, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils';
import { Button } from '../ui';

export const Modal = forwardRef(({ isOpen, title, onClose, options, children, className, ...props }, ref) => {
    const modalRef = useRef(null);

    options = {
      size: 'md',
      showClose: true,
      closeOnClickOutside: true,
      loading: false,
      ...options,
    };
  
    const handleClickOutside = (e) => {
      if (options.closeOnClickOutside && modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
  
    const getModalSize = (size = 'md') => {
      const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-full mx-4'
      };
      return sizes[size];
    };
  
    if (!isOpen) return null;
  
    return createPortal(
      <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div
            ref={ref}
            className={cn(
              "inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full",
              className
            )}
            {...props}
          >
            <div className="absolute right-0">
              <Button onClick={onClose} variant="outline" className="text-red-600 border-none">
                  X
              </Button>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                {title || options.title}
              </h3>
              <div className="mt-2">{children}</div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
});

export default Modal;