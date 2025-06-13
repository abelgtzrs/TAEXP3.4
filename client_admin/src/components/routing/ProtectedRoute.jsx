// src/components/routing/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  // Use our custom hook to get authentication status.
  const { isAuthenticated, loading } = useAuth();

  // While we're checking for a token on initial load, don't render anything.
  if (loading) {
    return <div>Loading...</div>; // Or a nice spinner component
  }

  // If the user is authenticated, render the child route's component via the <Outlet />.
  // If not, redirect them to the /login page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
