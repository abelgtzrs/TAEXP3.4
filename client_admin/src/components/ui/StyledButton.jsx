// Your application's standard button
const StyledButton = ({ children, onClick, type = "button", loading = false, className = "", variant = "primary" }) => {
  const baseClasses =
    "relative font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed overflow-hidden group";

  const variants = {
    primary:
      "bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-primary/50 disabled:from-gray-600 disabled:to-gray-700",
    secondary:
      "bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-gray-500/50 disabled:from-gray-800 disabled:to-gray-900",
    danger:
      "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-red-500/50 disabled:from-gray-600 disabled:to-gray-700",
    success:
      "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-green-500/50 disabled:from-gray-600 disabled:to-gray-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700"></div>

      {/* Button content */}
      <span className="relative flex items-center justify-center gap-2">
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {loading ? "Loading..." : children}
      </span>
    </button>
  );
};
export default StyledButton;
