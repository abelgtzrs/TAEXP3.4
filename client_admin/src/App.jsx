// --- FILE: client-admin/src/App.jsx (Corrected) ---
import { Routes, Route, Navigate } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import HabitsPage from "./pages/HabitsPage";
import BooksPage from "./pages/BooksPage";
import WorkoutPage from "./pages/WorkoutPage";
import SelectTemplatePage from "./pages/SelectTemplatePage";
import LogWorkoutPage from "./pages/LogWorkoutPage";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import AdminRoute from "./components/routing/AdminRoute";
import VolumesPage from "./pages/VolumesPage";
import EditVolumePage from "./pages/EditVolumePage";
import AdminExercisesPage from "./pages/AdminExercisesPage";
import AdminTemplatesPage from "./pages/AdminTemplatesPage";
import ShopPage from "./pages/ShopPage";
import ProfilePage from "./pages/ProfilePage";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionDetailPage from "./pages/CollectionDetailPage";
import PokedexPage from "./pages/PokedexPage";
import PokemonEditorPage from "./pages/PokemonEditorPage";
import HabboRareManagement from "./pages/HabboRareManagement";
import SettingsPage from "./pages/SettingsPage";
import TasksPage from "./pages/TasksPage";
import FinancePage from "./pages/FinancePage";
import SpotifyStatsPage from "./pages/SpotifyStatsPage";

function App() {
  useTheme();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* General Protected Routes for all logged-in users */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/workouts" element={<WorkoutPage />} />
          <Route path="/workouts/log" element={<LogWorkoutPage />} />
          <Route path="/workouts/new/template" element={<SelectTemplatePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/spotify-stats" element={<SpotifyStatsPage />} />
        </Route>
      </Route>

      {/* Admin-Only Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/volumes" element={<VolumesPage />} />
          <Route path="/admin/volumes/edit/:volumeId" element={<EditVolumePage />} />
          <Route path="/admin/exercises" element={<AdminExercisesPage />} />
          <Route path="/admin/templates" element={<AdminTemplatesPage />} />
          <Route path="/admin/habbo-rares" element={<HabboRareManagement />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:collectionType" element={<CollectionDetailPage />} />
          <Route path="/pokedex" element={<PokedexPage />} />
          <Route path="/admin/pokemon-editor" element={<PokemonEditorPage />} />
        </Route>
      </Route>

      {/* Catch-all Not Found Route */}
      <Route
        path="*"
        element={
          <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
            <h1 className="text-4xl">404 - Not Found</h1>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
