import { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationCircle, 
  faExclamationTriangle, 
  faInfoCircle 
} from '@fortawesome/free-solid-svg-icons';
import { useModal } from './useModal';
import { cn } from '../../../utils/cn';

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

export default useAlertModal;