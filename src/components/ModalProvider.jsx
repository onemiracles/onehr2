import React, { createContext, useContext, useCallback, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faCheckCircle, 
  faExclamationCircle, 
  faExclamationTriangle, 
  faInfoCircle 
} from '@fortawesome/free-solid-svg-icons';
import { Spinner } from './ui';
import { cn } from '../utils/cn';

// Context
const ModalContext = createContext();

// Modal Component
const Modal = ({ isOpen, content, options, onClose }) => {
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
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div 
        className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0"
        onClick={handleClickOutside}
      >
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75" 
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          ref={modalRef}
          className={cn(
            "relative inline-block w-full text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl",
            getModalSize(options.size),
            options.className
          )}
        >
          {/* Header */}
          {(options.title || options.showClose) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              {options.title && (
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {options.title}
                </h3>
              )}
              {options.showClose && (
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={onClose}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-4">
            {options.loading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner size="large" className="text-primary-600 dark:text-primary-400" />
              </div>
            ) : (
              content
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Provider
export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  const show = useCallback((content, options = {}) => {
    const defaultOptions = {
      size: 'md',
      showClose: true,
      closeOnClickOutside: true,
      loading: false,
      ...options,
    };

    setModals(prev => [...prev, { isOpen: true, content, options: defaultOptions }]);
  }, []);

  const hide = useCallback(() => {
    setModals(prev => {
      const newModals = [...prev];
      if (newModals.length > 0) {
        newModals[newModals.length - 1].isOpen = false;
        return newModals.slice(0, -1);
      }
      return newModals;
    });
  }, []);

  const hideAll = useCallback(() => {
    setModals([]);
  }, []);

  const contextValue = {
    show,
    hide,
    hideAll,
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
            hide();
          }}
        />
      ))}
    </ModalContext.Provider>
  );
};

// Hook
export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// Custom hooks for common modal patterns
export const useConfirmModal = () => {
  const { show, hide } = useModal();

  const confirm = useCallback(({
    title = 'Confirm',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'primary'
  }) => {
    show(
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            onClick={() => {
              onCancel?.();
              hide();
            }}
          >
            {cancelText}
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium text-white rounded-md",
              variant === 'primary' && "bg-primary-600 hover:bg-primary-700",
              variant === 'danger' && "bg-red-600 hover:bg-red-700",
              variant === 'warning' && "bg-yellow-600 hover:bg-yellow-700"
            )}
            onClick={() => {
              onConfirm();
              hide();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>,
      {
        title,
        size: 'sm',
        closeOnClickOutside: false,
      }
    );
  }, [show, hide]);

  return confirm;
};

// Alert modal hook
export const useAlertModal = () => {
  const { show, hide } = useModal();

  const alert = useCallback(({
    title = 'Alert',
    message,
    type = 'info',
    confirmText = 'OK'
  }) => {
    const icons = {
      success: faCheckCircle,
      error: faExclamationCircle,
      warning: faExclamationTriangle,
      info: faInfoCircle
    };

    const colors = {
      success: 'text-green-500',
      error: 'text-red-500',
      warning: 'text-yellow-500',
      info: 'text-blue-500'
    };

    show(
      <div className="text-center space-y-4">
        <FontAwesomeIcon 
          icon={icons[type]} 
          className={cn('text-4xl', colors[type])} 
        />
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
          onClick={hide}
        >
          {confirmText}
        </button>
      </div>,
      {
        title,
        size: 'sm',
        showClose: false,
      }
    );
  }, [show, hide]);

  return alert;
};