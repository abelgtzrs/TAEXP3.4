const Widget = ({ title, children, className = "" }) => {
  return (
    <div className={`widget-container p-2 md:p-2 h-full flex flex-col ${className}`}>
      {title && (
        <div className="border-b border-gray-700/50 p-2">
          <h3 className="text-m font-semibold uppercase text-text-secondary tracking-wider">{title}</h3>
        </div>
      )}

      <div className="flex-1 flex flex-col p-2 py-4">{children}</div>
    </div>
  );
};

export default Widget;
