import { useCallback } from 'react';
import { useModal } from './useModal';
import { cn } from '../../../utils/cn';

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

export default useConfirmModal;