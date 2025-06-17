// src/components/layout/AdminLayout.jsx
import { Outlet, Link } from "react-router-dom"; // <-- IMPORT LINK

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-900">
      <aside className="w-64 bg-gray-800 p-4 text-gray-300">
        <h2 className="text-white font-bold text-2xl mb-8">TAEXP™</h2>
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
              </Link>{" "}
            </li>
            <li className="mb-4">
              <Link to="/books" className="hover:text-teal-400">
                Book Tracker
              </Link>{" "}
              {/* <-- ADD THIS LINK */}
            </li>
            {/* Add links to other pages here later */}
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
