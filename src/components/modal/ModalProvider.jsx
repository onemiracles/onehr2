import React, { useState, useCallback, useRef, forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button, Loading } from '../ui';
import { cn } from '../../utils/cn';
import ModalContext from './ModalContext';

// Modal Component
const Modal = forwardRef(({ isOpen, onClose, options, content, className, ...props }, ref) => {
  const modalRef = useRef(null);

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
              {options.title}
            </h3>
            <div className="mt-2">{content}</div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
});

// Provider Component
export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  const showModal = useCallback((content, options = {}) => {
    const defaultOptions = {
      size: 'md',
      showClose: true,
      closeOnClickOutside: true,
      loading: false,
      ...options,
    };
    const modal = { isOpen: true, content, options: defaultOptions };
    setModals(prev => [...prev, modal]);
    return modal;
  }, []);

  const hideModal = useCallback(() => {
    setModals(prev => {
      const newModals = [...prev];
      if (newModals.length > 0) {
        newModals[newModals.length - 1].isOpen = false;
        return newModals.slice(0, -1);
      }
      return newModals;
    });
  }, []);

  const hideAllModal = useCallback(() => {
    setModals([]);
  }, []);

  const contextValue = {
    showModal,
    hideModal,
    hideAllModal
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modals.map((modal, index) => (
        <Modal
          key={index}
          isOpen={modal.isOpen}
          content={modal.content}
          options={modal.options}
          onClose={() => {
            modal.options.onClose?.();
            hideModal();
          }}
        />
      ))}
    </ModalContext.Provider>
  );
};

export default ModalProvider;