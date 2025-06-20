// src/components/routing/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = () => {
  // Get the user's auth status, role, and loading state from our global context.
  const { isAuthenticated, user, loading } = useAuth();

  // While we're checking the user's status, show a loading message.
  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if the user is authenticated AND their role is 'admin'.
  if (isAuthenticated && user?.role === "admin") {
    // If they are an authenticated admin, render the requested child component.
    return <Outlet />;
  }

  if (!isAuthenticated) {
    // If they are not logged in at all, redirect them to the login page.
    return <Navigate to="/login" replace />;
  }

  // If they are logged in but NOT an admin, show a "Not Authorized" message.
  // You could also redirect them to the dashboard or a dedicated "403 Forbidden" page.
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl text-red-500">Access Denied</h1>
        <p className="text-gray-400 mt-2">
          You do not have permission to view this page.
        </p>
      </div>
    </div>
  );
};

export default AdminRoute;
