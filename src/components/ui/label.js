import React from 'react';

const Label = ({ className, children, ...props }) => {
  return (
    <label className={`block mb-2 ${className}`} {...props}>
      {children}
    </label>
  );
};

export { Label };