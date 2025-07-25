// Button component following shadcn/ui API but using your project's styling
import React from "react";

const Button = React.forwardRef(
  ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50",
      secondary: "bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500/50",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50",
      outline: "border border-gray-700 bg-transparent text-text-main hover:bg-gray-800 focus:ring-primary/50",
      ghost: "text-text-main hover:bg-gray-800 focus:ring-primary/50",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3",
      lg: "h-11 px-8",
    };

    return (
      <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export default Button;
