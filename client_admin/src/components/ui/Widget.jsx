// src/components/ui/Widget.jsx
const Widget = ({ title, children, className = "", padding = "p-6", titleChildren, variant = "surface" }) => {
  return (
    // We add `h-full` to make the widget fill its parent grid cell.
    // `flex flex-col` ensures the content inside can grow to fill the space.
    <div
      className={`h-full flex flex-col ${
        variant === "plain" ? "bg-transparent border-0 shadow-none" : "bg-surface border border-gray-700/50 shadow-lg"
      } ${className}`}
    >
      {/* Widget Header */}
      {title && (
        <div
          className={`px-6 py-4 flex-shrink-0 flex justify-between items-center ${
            variant === "plain" ? "border-b border-transparent" : "border-b border-gray-700/50"
          }`}
        >
          <h3 className="text-sm font-semibold uppercase text-text-secondary tracking-wider">{title}</h3>
          {titleChildren}
        </div>
      )}
      {/* Widget Content - `flex-grow` allows this area to expand and fill vertical space */}
      <div className={`${padding} flex-grow`}>{children}</div>
    </div>
  );
};

export default Widget;
