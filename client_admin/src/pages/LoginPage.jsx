// src/pages/LoginPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import our auth hook

const LoginPage = () => {
  // Use our custom hook to get the login function.
  const { login } = useAuth();

  // State for form inputs
  const [email, setEmail] = useState("abel@example.com"); // Pre-fill for easy testing
  const [password, setPassword] = useState("password123"); // Pre-fill for easy testing

  // State for handling errors
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)
    setError(""); // Clear previous errors

    try {
      // Call the login function from our AuthContext.
      await login(email, password);
      // Navigation happens inside the login function on success.
    } catch (err) {
      // If login fails, display an error message.
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="p-8 bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-teal-400 mb-6">
          Admin Panel Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-teal-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-teal-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
