import React from 'react';

const Button = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  type = 'button',
  className = '',
  onClick,
  icon: Icon,
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  
  const variants = {
    primary: 'border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'border-transparent text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'border-transparent text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    danger: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      ref={ref}
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon className="h-5 w-5 mr-2" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
