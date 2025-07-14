// Card components following shadcn/ui API but using your project's styling
import React from "react";

const Card = ({ className = "", children, ...props }) => {
  return (
    <div className={`rounded-lg border border-gray-700/50 bg-background shadow-lg ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ className = "", children, ...props }) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ className = "", children, ...props }) => {
  return (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight text-text-main ${className}`} {...props}>
      {children}
    </h3>
  );
};

const CardContent = ({ className = "", children, ...props }) => {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardContent };
