import React from 'react';
import { X } from 'lucide-react';

const Select = ({ 
  label, 
  id, 
  name, 
  value, 
  onChange, 
  children, 
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
      <select
        id={id}
        name={name || id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`block w-full py-2.5 pr-10 ${Icon ? 'pl-10' : 'pl-4'} border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none bg-white disabled:bg-gray-100 ${className}`}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 pr-3 flex items-center">
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
);

export default Select;
