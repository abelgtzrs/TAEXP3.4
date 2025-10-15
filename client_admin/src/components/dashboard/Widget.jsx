const Widget = ({ title, children, className = "" }) => {
  return (
    <div
      className={`widget-container p-2 md:p-2 h-full flex flex-col border rounded-lg ${className}`}
      style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-primary)" }}
    >
      {title && (
        <div className="border-b p-2" style={{ borderColor: "var(--color-primary)" }}>
          <h3 className="text-m font-semibold uppercase tracking-wider text-text-secondary">{title}</h3>
        </div>
      )}

      <div className="flex-1 flex flex-col p-2 py-4">{children}</div>
    </div>
  );
};

export default Widget;
