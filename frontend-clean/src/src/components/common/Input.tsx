import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
    const baseStyles = 'px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition';
    const normalStyles = 'border-gray-300 focus:border-primary focus:ring-primary';
    const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-red-500';
    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-gray-700 font-medium mb-2">{label}</label>
        )}
        <input
          ref={ref}
          className={`
            ${baseStyles}
            ${error ? errorStyles : normalStyles}
            ${widthStyles}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
