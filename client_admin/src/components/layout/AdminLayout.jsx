import { useState } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header";
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

const NavItem = ({ to, icon: Icon, children, isCollapsed }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center p-2 rounded-md transition-colors duration-200 text-text-secondary hover:bg-gray-700/50 hover:text-white ${
            isActive ? "bg-primary/10 text-white" : ""
          }`
        }
      >
        <Icon size={20} className="mr-3 flex-shrink-0" />
        {/* The text label is now conditionally rendered */}
        <span className={`transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>
          {children}
        </span>
      </NavLink>
    </li>
  );
};

const AdminLayout = () => {
  const { user, logout } = useAuth();
  // State to control the sidebar's collapsed status
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background text-text-main">
      {/* --- Sidebar --- */}
      {/* The width of the sidebar now changes based on state */}
      <aside
        className={`bg-surface p-4 flex-shrink-0 flex flex-col border-r border-gray-700/50 transition-all duration-500 ease-in-out ${
          isSidebarCollapsed ? "w-20" : "w-54"
        }`}
      >
        <div className="flex items-center gap-2 py-4 pb-14 mb-4">
          {/* The main title text is now conditionally rendered */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            <h1 className="text-white font-bold text-[12px] whitespace-nowrap">The Abel Experience™ CFW v3.4</h1>
          </div>
        </div>

        <nav className="flex-grow space-y-6 overflow-y-auto">
          <div>
            <p
              className={`px-2 text-xs font-semibold text-text-tertiary uppercase mb-2 transition-all duration-500 ease-in-out ${
                isSidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-2"
              }`}
            >
              Main
            </p>
            <ul className="space-y-1">
              <NavItem to="/dashboard" icon={LayoutDashboard} isCollapsed={isSidebarCollapsed}>
                Dashboard
              </NavItem>
              <NavItem to="/profile" icon={User} isCollapsed={isSidebarCollapsed}>
                Profile
              </NavItem>
              <NavItem to="/pokedex" icon={Image}>
                Pokédex
              </NavItem>
              <NavItem to="/shop" icon={Store} isCollapsed={isSidebarCollapsed}>
                Shop
              </NavItem>
            </ul>
          </div>

          <div>
            <p
              className={`px-2 text-xs font-semibold text-text-tertiary uppercase mb-2 transition-all duration-500 ease-in-out ${
                isSidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-2"
              }`}
            >
              {isSidebarCollapsed ? " " : "Trackers"}
            </p>
            <ul className="space-y-1">
              <NavItem to="/habits" icon={CheckSquare} isCollapsed={isSidebarCollapsed}>
                Habits
              </NavItem>
              <NavItem to="/books" icon={BookOpen} isCollapsed={isSidebarCollapsed}>
                Books
              </NavItem>
              <NavItem to="/workouts" icon={Dumbbell} isCollapsed={isSidebarCollapsed}>
                Workouts
              </NavItem>
            </ul>
          </div>

          {user?.role === "admin" && (
            <div>
              <p
                className={`px-2 text-xs font-semibold text-text-tertiary uppercase mb-2 ${
                  isSidebarCollapsed ? "text-center" : ""
                }`}
              >
                {isSidebarCollapsed ? " " : "Admin"}
              </p>
              <ul className="space-y-1">
                <NavItem to="/admin/volumes" icon={Library} isCollapsed={isSidebarCollapsed}>
                  Volume Administration
                </NavItem>
                <NavItem to="/admin/exercises" icon={Settings} isCollapsed={isSidebarCollapsed}>
                  Exercise Definition
                </NavItem>
                <NavItem to="/admin/templates" icon={Settings} isCollapsed={isSidebarCollapsed}>
                  Workout Management
                </NavItem>
                <NavItem to="/admin/pokemon-editor" icon={PenSquare}>
                  Pokémon Editor
                </NavItem>
              </ul>
            </div>
          )}
        </nav>

        <div className="mt-auto flex-shrink-0 border-t border-gray-700/50 pt-4">
          <button
            onClick={logout}
            className={`w-full flex items-center p-2 mt-2 rounded-md text-sm text-text-secondary hover:bg-red-800/50 hover:text-white transition-colors ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={20} className={isSidebarCollapsed ? "" : "mr-3"} />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
