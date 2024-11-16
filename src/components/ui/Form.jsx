import React, { forwardRef, useState } from 'react';
import { cn } from '../../utils/cn';

export const Form = forwardRef(({ onSubmit, children, className, ...props }, ref) => {
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Validate form data
    const validationErrors = validate(data);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // If no errors, call the onSubmit prop
      await onSubmit(data);
    }
  };

  const validate = (data) => {
    const errors = {};
    // Add your validation logic here
    // For example:
    // if (!data.email) {
    //   errors.email = 'Email is required';
    // }
    return errors;
  };

  // Clone children and pass down error prop
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { error: errors[child.props.name] });
    }
    return child;
  });

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)} {...props}>
      {childrenWithProps}
    </form>
  );
});

export const FormField = ({ label, name, children, error }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const FormActions = ({ children, className }) => {
  return (
    <div className={cn('flex justify-end space-x-2', className)}>
      {children}
    </div>
  );
};