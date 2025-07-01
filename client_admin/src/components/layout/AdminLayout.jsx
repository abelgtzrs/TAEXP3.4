// --- FILE: client-admin/src/components/layout/AdminLayout.jsx (Corrected) ---

import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header"; // This imports the Header component from the separate file

const AdminLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-900">
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-gray-800 p-4 text-gray-300 flex-shrink-0 flex flex-col">
        <h2 className="text-white font-bold text-2xl mb-8">Abel Exp™</h2>
        <nav className="flex-grow">
          <p className="text-xs text-gray-500 uppercase mb-2">Main</p>
          <ul>
            <li className="mb-2">
              <Link
                to="/dashboard"
                className="block p-2 rounded hover:bg-gray-700 hover:text-teal-400"
              >
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/profile"
                className="block p-2 rounded hover:bg-gray-700 hover:text-teal-400"
              >
                Profile
              </Link>
            </li>
          </ul>
          <p className="text-xs text-gray-500 uppercase mb-2 mt-4">Trackers</p>
          <ul>
            <li className="mb-2">
              <Link
                to="/habits"
                className="block p-2 rounded hover:bg-gray-700 hover:text-teal-400"
              >
                Habit Tracker
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/books"
                className="block p-2 rounded hover:bg-gray-700 hover:text-teal-400"
              >
                Book Tracker
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/workouts"
                className="block p-2 rounded hover:bg-gray-700 hover:text-teal-400"
              >
                Workout Tracker
              </Link>
            </li>
          </ul>
          {user?.role === "admin" && (
            <div className="border-t border-gray-700 pt-4 mt-4">
              <p className="text-xs text-gray-500 uppercase mb-2">
                Admin Panel
              </p>
              <ul>
                <li className="mb-2">
                  <Link
                    to="/admin/volumes"
                    className="block p-2 rounded hover:bg-gray-700 hover:text-teal-400"
                  >
                    Volume Manager
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/admin/exercises"
                    className="block p-2 rounded hover:bg-gray-700 hover:text-teal-400"
                  >
                    Exercise Definitions
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/admin/templates"
                    className="block p-2 rounded hover:bg-gray-700 hover:text-teal-400"
                  >
                    Workout Templates
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 1. The Header component is rendered here */}
        <Header />

        {/* 2. The main content now scrolls independently */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
