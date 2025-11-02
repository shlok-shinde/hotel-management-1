import React from 'react';

const Input = ({ 
  label, 
  id, 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '', 
  icon: Icon, 
  required = false, 
  disabled = false, 
  className = '' 
}) => (
  <div className="w-full">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <div className="relative rounded-md shadow-sm">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`block w-full py-2.5 pr-3 ${Icon ? 'pl-10' : 'pl-4'} border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 ${className}`}
      />
    </div>
  </div>
);

export default Input;
