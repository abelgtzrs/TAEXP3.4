// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import HabitsPage from "./pages/HabitsPage";
import BooksPage from "./pages/BooksPage";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes inside the Admin Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* Optional: A catch-all for unknown routes or a root redirect */}
      <Route path="*" element={<div>Not Found</div>} />
      {/* If you want users at the root "/" to be redirected to the dashboard if logged in:
          The ProtectedRoute component already handles redirecting to /login if not authenticated.
          We can add a root path inside the protected routes. */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
export default App;

// You might need to import Navigate at the top
// import { Routes, Route, Navigate } from 'react-router-dom';
