// A standard header for every page
const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-4">
      <h1 className="text-xl md:text-2xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-text-secondary mt-1">{subtitle}</p>}
    </div>
  );
};
export default PageHeader;
