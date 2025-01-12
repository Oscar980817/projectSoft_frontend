import React from 'react';
import PropTypes from 'prop-types';

const Alert = ({ className, children }) => {
  return (
    <div className={`p-4 border rounded-md flex items-start space-x-2 ${className}`}>
      {children}
    </div>
  );
};

Alert.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const AlertTitle = ({ children }) => {
  return <h4 className="font-semibold">{children}</h4>;
};

AlertTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

const AlertDescription = ({ children }) => {
  return <p>{children}</p>;
};

AlertDescription.propTypes = {
  children: PropTypes.node.isRequired,
};

export { Alert, AlertTitle, AlertDescription };