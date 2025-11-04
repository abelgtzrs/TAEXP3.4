// src/components/ui/Widget.jsx
import React from "react";

const Widget = ({ title, children, className = "", padding = "p-6", titleChildren, variant = "surface" }) => {
  // React to Customize UI menu (AdminLayout) changes via root data attribute and CSS vars
  const [glassOn, setGlassOn] = React.useState(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.getAttribute("data-glass") === "on";
  });

  React.useEffect(() => {
    const refresh = () => {
      if (typeof document === "undefined") return;
      setGlassOn(document.documentElement.getAttribute("data-glass") === "on");
    };
    window.addEventListener("tae:settings-changed", refresh);
    return () => window.removeEventListener("tae:settings-changed", refresh);
  }, []);

  const baseClasses = "h-full flex flex-col rounded-lg";
  const surfaceClasses = "bg-surface border border-gray-700/50 shadow-lg";
  const plainClasses = "bg-transparent border-0 shadow-none";

  // When glass is ON and variant is not plain, use CSS variables provided by the customizer
  const useGlass = glassOn && variant !== "plain";
  const containerStyle = useGlass
    ? {
        backgroundColor: "rgba(0,0,0, var(--glass-surface-alpha))",
        backdropFilter: "saturate(180%) blur(var(--glass-blur))",
        WebkitBackdropFilter: "saturate(180%) blur(var(--glass-blur))",
        border: "1px solid rgba(255,255,255,0.08)",
      }
    : undefined;

  const headerBorderClass =
    variant === "plain" ? "border-transparent" : useGlass ? "border-white/10" : "border-gray-700/50";

  return (
    <div
      className={`${baseClasses} ${
        variant === "plain" ? plainClasses : useGlass ? "bg-transparent" : surfaceClasses
      } ${className}`}
      style={containerStyle}
    >
      {title && (
        <div className={`px-6 py-4 flex-shrink-0 flex justify-between items-center border-b ${headerBorderClass}`}>
          <h3 className="text-sm font-semibold uppercase text-text-secondary tracking-wider">{title}</h3>
          {titleChildren}
        </div>
      )}
      <div className={`${padding} flex-grow`}>{children}</div>
    </div>
  );
};

export default Widget;
