// Your application's standard text input
const StyledInput = ({ type = "text", className = "", ...props }) => {
  return (
    <input
      type={type}
      className={`w-full p-3 bg-background rounded-md border border-gray-700/50 text-text-main placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition duration-200 ${className}`}
      {...props}
    />
  );
};
export default StyledInput;
