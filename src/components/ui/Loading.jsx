import React, { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { cn } from '../../utils/cn';

export const Loading = forwardRef(({ className, variant = 'spinner', color = 'primary', size = 'large', ...props }, ref) => {
    let icon = <></>;
    if (variant === 'spinner') {
        icon = <Spinner
            ref={ref}
            className={className}
            size={size}
            {...props} 
        />
    }

    return (<div className="flex justify-center items-center h-full">
        {icon}
    </div>)
});

export const Spinner = ({ size = 'large', color = 'primary', className }) => {
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
