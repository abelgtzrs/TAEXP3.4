// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import HabitsPage from "./pages/HabitsPage";
import BooksPage from "./pages/BooksPage";
import AdminRoute from "./components/routing/AdminRoute";
import VolumesPage from "./pages/VolumesPage";
import EditVolumePage from "./pages/EditVolumePage";
import WorkoutPage from "./pages/WorkoutPage";
import SelectTemplatePage from "./pages/SelectTemplatePage";
import LogWorkoutPage from "./pages/LogWorkoutPage"; //

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
          <Route path="/workouts" element={<WorkoutPage />} />
          <Route path="/workouts/log" element={<LogWorkoutPage />} />
          <Route
            path="/workouts/new/template"
            element={<SelectTemplatePage />}
          />
          <Route path="/workouts/new/clean" element={<LogWorkoutPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* Admin-Only Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/volumes" element={<VolumesPage />} />
          <Route
            path="/admin/volumes/edit/:volumeId"
            element={<EditVolumePage />}
          />
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
