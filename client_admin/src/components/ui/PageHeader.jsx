// A standard header for every page with optional right-side actions
const PageHeader = ({ title, subtitle, className = "", compact = true, actions = null }) => {
  const base = compact ? "mt-1 mb-0" : "mt-2 mb-2";
  return (
    <div className={`${base} pl-3 ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-white leading-tight">{title}</h1>
          {subtitle && <p className="text-text-secondary mt-0.5 text-xs md:text-sm leading-snug">{subtitle}</p>}
        </div>
        {actions && <div className="flex-shrink-0 pr-3 pt-0.5">{actions}</div>}
      </div>
    </div>
  );
};
export default PageHeader;
