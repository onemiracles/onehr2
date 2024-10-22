import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export const Button = forwardRef(({ children, className, variant = 'primary', size = 'medium', ...props }, ref) => {
  const baseClasses = 'font-bold rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    outline: 'dark:text-white dark:border-white bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 focus:ring-primary-500',
  };
  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  return (
    <button
      ref={ref}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

export const Input = forwardRef(({ label, id, error, className, ...props }, ref) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500",
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600",
          "text-gray-900 dark:text-gray-100"
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

export const Select = forwardRef(({ children, label, options, className, ...props }, ref) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          "w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500",
          "text-gray-900 dark:text-gray-100"
        )}
        {...props}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
    </div>
  );
});

export const Card = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
});

export const Spinner = ({ size = 'medium', className }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <FontAwesomeIcon
      icon={faSpinner}
      className={cn("animate-spin text-primary-600 dark:text-primary-400", sizeClasses[size], className)}
    />
  );
};

export const Table = forwardRef(({ headers, data, className, ...props }, ref) => {
  return (
    <div className="overflow-x-auto">
      <table ref={ref} className={cn("min-w-full divide-y divide-gray-200 dark:divide-gray-700", className)} {...props}>
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export const Modal = forwardRef(({ isOpen, onClose, title, children, className, ...props }, ref) => {
  if (!isOpen) return null;

  return (
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
              {title}
            </h3>
            <div className="mt-2">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const Checkbox = forwardRef(({ label, className, ...props }, ref) => {
  return (
    <div className={cn("flex items-center", className)}>
      <input
        ref={ref}
        type="checkbox"
        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        {...props}
      />
      {label && (
        <label htmlFor={props.id} className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
          {label}
        </label>
      )}
    </div>
  );
});

export const Radio = forwardRef(({ label, className, ...props }, ref) => {
  return (
    <div className={cn("flex items-center", className)}>
      <input
        ref={ref}
        type="radio"
        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
        {...props}
      />
      {label && (
        <label htmlFor={props.id} className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
          {label}
        </label>
      )}
    </div>
  );
});

export const Progress = forwardRef(({ value, max = 100, className, ...props }, ref) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div ref={ref} className={cn("w-full bg-gray-200 rounded-full dark:bg-gray-700", className)} {...props}>
      <div
        className="bg-primary-600 text-xs font-medium text-primary-100 text-center p-0.5 leading-none rounded-full"
        style={{ width: `${percentage}%` }}
      >
        {percentage}%
      </div>
    </div>
  );
});

export const Tabs = React.forwardRef(({ 
    value, 
    onChange, 
    tabs = [], 
    variant = 'default',
    className,
    ...props 
  }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "border-b border-gray-200 dark:border-gray-700",
          className
        )}
        {...props}
      >
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={cn(
                "relative py-2 px-1 group inline-flex items-center transition-colors duration-200",
                "hover:text-primary-600 dark:hover:text-primary-400",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                value === tab.value
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-500 dark:text-gray-400",
              )}
            >
              {tab.icon && (
                <tab.icon 
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === tab.value
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-gray-400 dark:text-gray-500"
                  )}
                />
              )}
              {tab.label}
              {/* Active indicator line */}
              <span
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200",
                  value === tab.value
                    ? "bg-primary-600 dark:bg-primary-400"
                    : "bg-transparent group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                )}
              />
            </button>
          ))}
        </nav>
      </div>
    );
  });
  
  // TabPanel component for content
  export const TabPanel = React.forwardRef(({ children, value, tabValue, className, ...props }, ref) => {
    if (value !== tabValue) return null;
  
    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn("py-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  });