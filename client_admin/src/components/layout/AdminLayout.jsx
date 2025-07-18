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
  Boxes,
  ChevronLeft,
  ChevronRight,
  Settings2,
} from "lucide-react";

const NavItem = ({ to, icon: Icon, children, isCollapsed }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center p-3 rounded-lg transition-all duration-300 text-text-secondary hover:bg-gray-700/50 hover:text-white group ${
            isActive ? "bg-primary/20 text-white shadow-lg" : ""
          } ${isCollapsed ? "justify-center" : ""}`
        }
      >
        <Icon size={20} className={`flex-shrink-0 ${isCollapsed ? "" : "mr-3"}`} />
        <span
          className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}
        >
          {children}
        </span>
      </NavLink>
    </li>
  );
};

const AdminLayout = () => {
  const { user, logout } = useAuth();
  // State to control the sidebar's collapsed status
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Start collapsed

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-background text-text-main relative">
      {/* --- Header (Full Width) --- */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <Header />
      </div>

      {/* --- Main Content Area (with left margin for sidebar and top padding for header) --- */}
      <div className="flex-1 flex flex-col overflow-hidden ml-20 pt-16">
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto scrollbar-hide">
          <Outlet />
        </main>
      </div>

      {/* --- Backdrop (when sidebar is expanded) --- */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-500"
          onClick={toggleSidebar}
        />
      )}

      {/* --- Floating Sidebar --- */}
      <aside
        className={`fixed left-0 top-1/2 transform -translate-y-1/2 bg-surface/40 backdrop-blur-md border border-gray-700/80 rounded-r-2xl shadow-2xl z-50 flex flex-col transition-all duration-500 ease-in-out ${
          isSidebarCollapsed ? "w-16 translate-x-0 shadow-lg" : "w-80 translate-x-0 shadow-2xl shadow-primary/10"
        }`}
        style={{ maxHeight: "80vh" }}
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full bg-surface/80 backdrop-blur-md border border-gray-700/30 rounded-r-lg p-2 hover:bg-gray-700/50 transition-all duration-300 shadow-lg group"
        >
          <div className="transition-transform duration-300 group-hover:scale-110">
            {isSidebarCollapsed ? (
              <ChevronRight size={20} className="text-white" />
            ) : (
              <ChevronLeft size={20} className="text-white" />
            )}
          </div>
        </button>

        <div className="p-4 flex-shrink-0">
          {/* Header */}
          <div className={`flex items-center gap-2 py-2 mb-4 ${isSidebarCollapsed ? "justify-center" : ""}`}>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              <h1 className="text-white font-bold text-xs whitespace-nowrap">The Abel Experience™ CFW</h1>
            </div>
            {isSidebarCollapsed && (
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-sm">AE</span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-grow space-y-4 overflow-y-auto scrollbar-hide px-2">
          <div>
            <p
              className={`px-2 text-xs font-semibold text-text-tertiary uppercase mb-3 transition-all duration-500 ease-in-out ${
                isSidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-3"
              }`}
            >
              Main
            </p>
            <ul className="space-y-2">
              <NavItem to="/dashboard" icon={LayoutDashboard} isCollapsed={isSidebarCollapsed}>
                Dashboard
              </NavItem>
              <NavItem to="/profile" icon={User} isCollapsed={isSidebarCollapsed}>
                Profile
              </NavItem>
              <NavItem to="/pokedex" icon={Image} isCollapsed={isSidebarCollapsed}>
                Pokédex
              </NavItem>
              <NavItem to="/shop" icon={Store} isCollapsed={isSidebarCollapsed}>
                Shop
              </NavItem>
              <NavItem to="/collections" icon={Boxes} isCollapsed={isSidebarCollapsed}>
                Collections
              </NavItem>
            </ul>
          </div>

          <div>
            <p
              className={`px-2 text-xs font-semibold text-text-tertiary uppercase mb-3 transition-all duration-500 ease-in-out ${
                isSidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-3"
              }`}
            >
              Trackers
            </p>
            <ul className="space-y-2">
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
                className={`px-2 text-xs font-semibold text-text-tertiary uppercase mb-3 transition-all duration-500 ease-in-out ${
                  isSidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-3"
                }`}
              >
                Admin
              </p>
              <ul className="space-y-2">
                <NavItem to="/admin/volumes" icon={Library} isCollapsed={isSidebarCollapsed}>
                  Volume Administration
                </NavItem>
                <NavItem to="/admin/exercises" icon={Settings} isCollapsed={isSidebarCollapsed}>
                  Exercise Definition
                </NavItem>
                <NavItem to="/admin/templates" icon={Settings} isCollapsed={isSidebarCollapsed}>
                  Workout Management
                </NavItem>
                <NavItem to="/admin/pokemon-editor" icon={PenSquare} isCollapsed={isSidebarCollapsed}>
                  Pokémon Editor
                </NavItem>
                <NavItem to="/settings" icon={Settings2} isCollapsed={isSidebarCollapsed}>
                  Settings
                </NavItem>
              </ul>
            </div>
          )}
        </nav>

        <div className="mt-auto flex-shrink-0 border-t border-gray-700/50 pt-4 px-2">
          <button
            onClick={logout}
            className={`w-full flex items-center p-3 rounded-lg text-sm text-text-secondary hover:bg-red-800/50 hover:text-white transition-all duration-300 ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={20} className={isSidebarCollapsed ? "" : "mr-3"} />
            <span
              className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default AdminLayout;
