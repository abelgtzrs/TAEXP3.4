// src/components/ui/Widget.jsx
const Widget = ({ title, children, className = "", padding = "p-6" }) => {
  return (
    // The main container now uses your surface color from tailwind.config.js
    <div className={`bg-surface border border-gray-700/50 rounded-lg shadow-lg ${className}`}>
      {/* Widget Header */}
      {title && (
        <div className="px-6 py-4 border-b border-gray-700/50">
          <h3 className="text-sm font-semibold uppercase text-text-secondary tracking-wider">{title}</h3>
        </div>
      )}
      {/* Widget Content */}
      <div className={padding}>{children}</div>
    </div>
  );
};

export default Widget;
