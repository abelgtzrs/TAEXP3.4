import { Outlet, Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header"; // This imports the Header component
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Dumbbell,
  Library,
  Users,
  Settings,
  User,
  LogOut,
  Store,
  Image,
  PenSquare,
  ClipboardList,
  Clapperboard,
} from "lucide-react";

// Reusable NavItem component for sidebar links
const NavItem = ({ to, icon: Icon, children }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center p-2 rounded-md transition-colors duration-200 text-xs text-text-secondary hover:bg-gray-700/50 hover:text-white ${
            isActive ? "bg-primary/10 text-white" : ""
          }`
        }
      >
        <Icon size={16} className="mr-2 flex-shrink-0" />
        <span>{children}</span>
      </NavLink>
    </li>
  );
};

const AdminLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-background text-text-main">
      {/* --- Sidebar --- */}
      <aside className="w-48 bg-surface p-3 flex-shrink-0 flex flex-col border-r border-gray-700/50">
        <div className="flex items-center gap-2 px-2 pb-4 mb-3 border-b border-gray-700/50">
          <h1 className="text-white font-bold text-xs">The Abel Experience™</h1>
        </div>

        <nav className="flex-grow space-y-4 overflow-y-auto">
          <div>
            <p className="px-2 text-xs font-semibold text-text-tertiary uppercase mb-1">Main</p>
            <ul className="space-y-1">
              <NavItem to="/dashboard" icon={LayoutDashboard}>
                Dashboard
              </NavItem>
              <NavItem to="/profile" icon={User}>
                Profile
              </NavItem>
              <NavItem to="/shop" icon={Store}>
                Shop (Gacha)
              </NavItem>
              <NavItem to="/pokedex" icon={Image}>
                Pokédex
              </NavItem>
            </ul>
          </div>

          <div>
            <p className="px-2 text-xs font-semibold text-text-tertiary uppercase mb-1">Trackers</p>
            <ul className="space-y-1">
              <NavItem to="/habits" icon={CheckSquare}>
                Habit Tracker
              </NavItem>
              <NavItem to="/books" icon={BookOpen}>
                Book Tracker
              </NavItem>
              <NavItem to="/workouts" icon={Dumbbell}>
                Workout Tracker
              </NavItem>
              {/* You can add Task, Note, and Media trackers here later */}
            </ul>
          </div>

          {user?.role === "admin" && (
            <div>
              <p className="px-2 text-xs font-semibold text-text-tertiary uppercase mb-1">Admin Panel</p>
              <ul className="space-y-1">
                <NavItem to="/admin/volumes" icon={Library}>
                  Volume Manager
                </NavItem>
                <NavItem to="/admin/exercises" icon={Settings}>
                  Exercise Definitions
                </NavItem>
                <NavItem to="/admin/templates" icon={Settings}>
                  Workout Templates
                </NavItem>
                <NavItem to="/admin/pokemon-editor" icon={PenSquare}>
                  Pokémon Editor
                </NavItem>

                {/* Add links for User Management and Showcases here later */}
              </ul>
            </div>
          )}
        </nav>

        <div className="mt-auto flex-shrink-0 border-t border-gray-700/50 pt-3">
          <button
            onClick={logout}
            className="w-full flex items-center p-2 rounded-md text-xs text-text-secondary hover:bg-red-800/50 hover:text-white transition-colors"
          >
            <LogOut size={16} className="mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* The Header is rendered at the top */}
        <Header />

        {/* The page content will scroll independently below the fixed header */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
