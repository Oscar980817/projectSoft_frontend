import React from 'react';

const Card = ({ className, children, ...props }) => {
  return (
    <div className={`bg-white shadow-md rounded ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={`p-4 border-b ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ className, children, ...props }) => {
  return (
    <div className={`p-4 border-t ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ className, children, ...props }) => {
  return (
    <h2 className={`text-xl font-bold ${className}`} {...props}>
      {children}
    </h2>
  );
};

const CardDescription = ({ className, children, ...props }) => {
  return (
    <p className={`text-gray-600 ${className}`} {...props}>
      {children}
    </p>
  );
};

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription };