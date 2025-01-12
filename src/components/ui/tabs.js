import React, { useState } from 'react';

const Tabs = ({ defaultValue, children, className, ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={className} {...props}>
      {React.Children.map(children, child => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeTab });
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ children, activeTab, setActiveTab, className, ...props }) => {
  return (
    <div className={`flex ${className}`} {...props}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

const TabsTrigger = ({ value, activeTab, setActiveTab, className, children, ...props }) => {
  const isActive = value === activeTab;
  return (
    <button
      className={`px-4 py-2 ${isActive ? 'border-b-2 border-blue-500' : ''} ${className}`}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, activeTab, children, className, ...props }) => {
  return value === activeTab ? (
    <div className={className} {...props}>
      {children}
    </div>
  ) : null;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };