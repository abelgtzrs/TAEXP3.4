const Widget = ({ title, children, className = "" }) => {
  return (
    // We apply our custom CSS class 'widget-container' and any additional layout classes.
    <div className={`widget-container p-4 md:p-6 ${className}`}>
      {/* The widget's title, styled with HUD aesthetics */}
      {title && <h3 className="text-sm font-bold uppercase text-sky-300/80 mb-4 tracking-wider">{title}</h3>}
      {/* This is where the actual content of the widget will go */}
      <div>{children}</div>
    </div>
  );
};

export default Widget;
