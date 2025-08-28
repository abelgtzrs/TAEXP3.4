// A standard header for every page
const PageHeader = ({ title, subtitle, className = "", compact = true }) => {
  const base = compact ? "mt-1 mb-0" : "mt-2 mb-2";
  return (
    <div className={`${base} pl-3 ${className}`}>
      <h1 className="text-lg md:text-xl font-bold text-white leading-tight">{title}</h1>
      {subtitle && <p className="text-text-secondary mt-0.5 text-xs md:text-sm leading-snug">{subtitle}</p>}
    </div>
  );
};
export default PageHeader;
