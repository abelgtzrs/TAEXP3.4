// Your application's standard button
const StyledButton = ({ children, onClick, type = "button", loading = false, className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`bg-primary hover:opacity-80 text-background font-bold py-3 px-6 rounded-lg transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? "Saving..." : children}
    </button>
  );
};
export default StyledButton;
