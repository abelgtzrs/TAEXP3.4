const Widget = ({ title, children, className = '' }) => {
  return (

    <div className={`widget-container p-4 md:p-6 ${className}`}>

      {title && (
        <h3 className="text-sm font-semibold uppercase text-teal-300/80 mb-4 tracking-wider">
          {title}
        </h3>
      )}

      <div>
        {children}
      </div>
    </div>
  );
};

export default Widget;