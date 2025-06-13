// src/services/api.js
import axios from "axios";

// Create an Axios instance with a base URL.
// The VITE_API_BASE_URL should be in your .env.local file.
// Example: VITE_API_BASE_URL=http://localhost:5000/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios Request Interceptor: This function runs BEFORE each request is sent.
// It's the perfect place to automatically add the JWT to the authorization header.
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage (or wherever you store it).
    const token = localStorage.getItem("token");
    if (token) {
      // If the token exists, add it to the 'Authorization' header.
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config; // Return the modified config.
  },
  (error) => {
    // Handle request errors.
    return Promise.reject(error);
  }
);

export default api;
