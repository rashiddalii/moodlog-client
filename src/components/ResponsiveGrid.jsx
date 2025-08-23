import React from 'react';

// Responsive grid component for dashboard layout
export const ResponsiveGrid = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
};

// Responsive card wrapper
export const ResponsiveCard = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Mobile-first responsive container
export const ResponsiveContainer = ({ children, className = '' }) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 ${className}`}>
      {children}
    </div>
  );
};

// Responsive text component
export const ResponsiveText = ({ 
  children, 
  className = '', 
  size = 'base',
  weight = 'normal' 
}) => {
  const sizeClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl',
    '4xl': 'text-4xl sm:text-5xl'
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <div className={`${sizeClasses[size]} ${weightClasses[weight]} ${className}`}>
      {children}
    </div>
  );
};

