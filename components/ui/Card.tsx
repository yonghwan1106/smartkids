
import React from 'react';

export const Card: React.FC<{children: React.ReactNode; className?: string}> = ({ children, className = '' }) => (
  <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader: React.FC<{children: React.ReactNode; className?: string}> = ({ children, className = '' }) => (
  <div className={`p-4 sm:p-5 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{children: React.ReactNode; className?: string}> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-800 ${className}`}>
    {children}
  </h3>
);

export const CardContent: React.FC<{children: React.ReactNode; className?: string}> = ({ children, className = '' }) => (
  <div className={`p-4 sm:p-5 ${className}`}>
    {children}
  </div>
);
