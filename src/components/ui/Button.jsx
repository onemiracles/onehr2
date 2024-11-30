import { forwardRef } from "react";
import { cn } from "../../utils";

export const Button = forwardRef(({ children, className, variant = 'primary', size = 'medium', ...props }, ref) => {
    const baseClasses = 'font-bold rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis';
    const variantClasses = {
      white: 'bg-white text-black hover:bg-gray-100 focus:ring-gray-300 dark:bg-black dark:text-white dark:hover:bg-gray-800 dark:focus:ring-gray-700',
      primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
      secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500',
      success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400',
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