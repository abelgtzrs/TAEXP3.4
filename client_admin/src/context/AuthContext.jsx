// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Our pre-configured axios instance

// 1. Create the Context
// This creates an object that components can subscribe to.
const AuthContext = createContext(null);

// 2. Create the Provider Component
// This component will wrap our application and provide the auth state.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true); // To check initial auth status
  const navigate = useNavigate();

  // This effect runs on initial app load to check for an existing token.
  useEffect(() => {
    const checkUser = async () => {
      if (token) {
        // If a token exists in localStorage, validate it with the /api/auth/me endpoint.
        try {
          const response = await api.get("/auth/me");
          setUser(response.data.data); // Set user data if token is valid
        } catch (error) {
          // If token is invalid, log out.
          console.error("Token validation failed", error);
          logout();
        }
      }
      setLoading(false); // Finished checking
    };
    checkUser();
  }, [token]); // Rerun if token changes

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, data } = response.data;

      // Store the token and user data
      localStorage.setItem("token", token);
      setToken(token);
      setUser(data);

      // Redirect to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      // You can add state to display this error on the login page
      throw error; // Re-throw error to be caught by the login form
    }
  };

  // Logout function
  const logout = () => {
    // Clear user data and token
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/login");
  };

  // The value provided to consuming components
  const value = {
    user,
    setUser,
    token,
    isAuthenticated: !!user, // True if user object exists, false otherwise
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Render children only when not loading, to prevent flicker */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Create a Custom Hook
// This makes it easy for components to access the auth context.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
