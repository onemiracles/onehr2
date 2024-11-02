import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronLeft, 
  faChevronRight,
  faAngleDoubleLeft,
  faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';

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

  export const Switch = React.forwardRef(({
    checked = false,
    onChange,
    disabled = false,
    label,
    size = 'default',
    className,
    ...props
  }, ref) => {
    const baseStyles = "relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2";
    const thumbStyles = "pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out";
    
    const sizes = {
      small: {
        switch: "h-5 w-9",
        thumb: "h-4 w-4",
        translate: "translate-x-4",
      },
      default: {
        switch: "h-6 w-11",
        thumb: "h-5 w-5",
        translate: "translate-x-5",
      },
      large: {
        switch: "h-7 w-14",
        thumb: "h-6 w-6",
        translate: "translate-x-7",
      },
    };
  
    return (
      <label className={cn(
        "inline-flex items-center",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}>
        <button
          type="button"
          role="switch"
          ref={ref}
          disabled={disabled}
          checked={checked}
          onChange={onChange}
          className={cn(
            baseStyles,
            sizes[size].switch,
            checked 
              ? 'bg-primary-600 dark:bg-primary-400' 
              : 'bg-gray-200 dark:bg-gray-700',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          onClick={() => !disabled && onChange?.(!checked)}
          aria-checked={checked}
          {...props}
        >
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-start pl-1",
              sizes[size].switch
            )}
            aria-hidden="true"
          >
            <span
              className={cn(
                thumbStyles,
                sizes[size].thumb,
                checked ? sizes[size].translate : "translate-x-0"
              )}
            />
          </span>
        </button>
        {label && (
          <span className={cn(
            "ml-3 text-sm",
            disabled 
              ? "text-gray-400 dark:text-gray-600" 
              : "text-gray-900 dark:text-gray-100"
          )}>
            {label}
          </span>
        )}
      </label>
    );
  });
  
  Switch.displayName = 'Switch';

  export const Pagination = React.forwardRef(({
    total = 0,
    pageSize = 10,
    currentPage = 1,
    onPageChange,
    onPageSizeChange,
    showPageSize = true,
    showTotal = true,
    disabled = false,
    className,
    pageSizeOptions = [10, 20, 50, 100],
    siblingCount = 1,
    ...props
  }, ref) => {
    const totalPages = Math.ceil(total / pageSize);
    
    // Calculate page range
    const getPageRange = () => {
      const range = [];
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
  
      const showLeftDots = leftSiblingIndex > 2;
      const showRightDots = rightSiblingIndex < totalPages - 1;
  
      if (!showLeftDots && showRightDots) {
        const leftItemCount = 3 + 2 * siblingCount;
        for (let i = 1; i <= leftItemCount; i++) {
          range.push(i);
        }
        range.push('...');
        range.push(totalPages);
      } else if (showLeftDots && !showRightDots) {
        range.push(1);
        range.push('...');
        const rightItemCount = 3 + 2 * siblingCount;
        for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
          range.push(i);
        }
      } else if (showLeftDots && showRightDots) {
        range.push(1);
        range.push('...');
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          range.push(i);
        }
        range.push('...');
        range.push(totalPages);
      } else {
        for (let i = 1; i <= totalPages; i++) {
          range.push(i);
        }
      }
  
      return range;
    };
  
    const handlePageChange = (page) => {
      if (disabled || page === currentPage) return;
      if (page >= 1 && page <= totalPages) {
        onPageChange?.(page);
      }
    };
  
    const handlePageSizeChange = (value) => {
      if (disabled) return;
      const newPageSize = Number(value);
      onPageSizeChange?.(newPageSize);
      // Adjust current page if necessary
      const newTotalPages = Math.ceil(total / newPageSize);
      if (currentPage > newTotalPages) {
        onPageChange?.(newTotalPages);
      }
    };
  
    const PageButton = ({ page, active = false }) => (
      <button
        type="button"
        onClick={() => handlePageChange(page)}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          active
            ? "bg-primary-600 text-white dark:bg-primary-500"
            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        {page}
      </button>
    );
  
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col sm:flex-row items-center justify-between gap-4",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          {showTotal && (
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Total {total} items
            </span>
          )}
          
          {showPageSize && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Show
              </span>
              <Select
                value={pageSize.toString()}
                onChange={(e) => handlePageSizeChange(e.target.value)}
                disabled={disabled}
                className="w-20"
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size.toString()}>
                    {size}
                  </option>
                ))}
              </Select>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                per page
              </span>
            </div>
          )}
        </div>
  
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(1)}
            disabled={disabled || currentPage === 1}
            className={cn(
              "p-1 rounded-md text-gray-500 dark:text-gray-400",
              "hover:bg-gray-100 dark:hover:bg-gray-700",
              "focus:outline-none focus:ring-2 focus:ring-primary-500",
              (disabled || currentPage === 1) && "opacity-50 cursor-not-allowed"
            )}
          >
            <FontAwesomeIcon icon={faAngleDoubleLeft} className="h-5 w-5" />
          </button>
  
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={disabled || currentPage === 1}
            className={cn(
              "p-1 rounded-md text-gray-500 dark:text-gray-400",
              "hover:bg-gray-100 dark:hover:bg-gray-700",
              "focus:outline-none focus:ring-2 focus:ring-primary-500",
              (disabled || currentPage === 1) && "opacity-50 cursor-not-allowed"
            )}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" />
          </button>
  
          <div className="flex items-center gap-1">
            {getPageRange().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-2 text-gray-500 dark:text-gray-400">
                    ...
                  </span>
                ) : (
                  <PageButton 
                    page={page} 
                    active={page === currentPage}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
  
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={disabled || currentPage === totalPages}
            className={cn(
              "p-1 rounded-md text-gray-500 dark:text-gray-400",
              "hover:bg-gray-100 dark:hover:bg-gray-700",
              "focus:outline-none focus:ring-2 focus:ring-primary-500",
              (disabled || currentPage === totalPages) && "opacity-50 cursor-not-allowed"
            )}
          >
            <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" />
          </button>
  
          <button
            type="button"
            onClick={() => handlePageChange(totalPages)}
            disabled={disabled || currentPage === totalPages}
            className={cn(
              "p-1 rounded-md text-gray-500 dark:text-gray-400",
              "hover:bg-gray-100 dark:hover:bg-gray-700",
              "focus:outline-none focus:ring-2 focus:ring-primary-500",
              (disabled || currentPage === totalPages) && "opacity-50 cursor-not-allowed"
            )}
          >
            <FontAwesomeIcon icon={faAngleDoubleRight} className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  });
  
  Pagination.displayName = 'Pagination';

  
export { Loading, Spinner } from './Loading';
export { Form } from './Form';
export { Table } from './Table';