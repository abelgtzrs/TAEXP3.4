// src/components/layout/AdminLayout.jsx
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import useAuth to check role

const AdminLayout = () => {
  const { user } = useAuth(); // Get user info

  return (
    <div className="flex h-screen bg-gray-900">
      <aside className="w-64 bg-gray-800 p-4 text-gray-300">
        <h2 className="text-white font-bold text-2xl mb-8">Abel Exp™</h2>
        <nav>
          <ul>
            <li className="mb-4">
              <Link to="/dashboard" className="hover:text-teal-400">
                Dashboard
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/habits" className="hover:text-teal-400">
                Habit Tracker
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/books" className="hover:text-teal-400">
                Book Tracker
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/workouts" className="hover:text-teal-400">
                Workout Tracker
              </Link>
            </li>
                {user?.role === 'admin' && (
                    <li className="mb-4 border-t border-gray-700 pt-4 mt-4">
                        <p className="text-xs text-gray-500 uppercase mb-2">Admin</p>
                        <Link to="/admin/volumes" className="block mb-2 hover:text-teal-400">Volume Manager</Link>
                        <Link to="/admin/exercises" className="block mb-2 hover:text-teal-400">Exercise Definitions</Link>
                        <Link to="/admin/templates" className="block mb-2 hover:text-teal-400">Workout Templates</Link>
                    </li>
                )}

          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
