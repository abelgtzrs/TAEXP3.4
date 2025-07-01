const Separator = ({ className = "" }) => {
  return (
    // This div is styled to be a thin, semi-transparent line with a subtle top glow,
    // which mimics the high-tech aesthetic.
    <div className={`w-full h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent ${className}`}></div>
  );
};

export default Separator;
