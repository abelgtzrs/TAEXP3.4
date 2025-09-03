import { useState, useEffect } from "react";
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
  DollarSign,
  Music,
  FileSignature,
} from "lucide-react";

const NavItem = ({ to, icon: Icon, children, isCollapsed }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `group flex items-center rounded-lg transition-all duration-300 text-text-secondary hover:bg-gray-700/50 hover:text-white px-2 py-2 ${
            isActive ? "bg-primary/20 text-white shadow-lg" : ""
          }`
        }
      >
        <span className="flex-none w-6 flex items-center justify-center">
          <Icon size={16} />
        </span>
        <span
          className={`ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ${
            isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const toggleSidebar = () => setIsSidebarCollapsed((p) => !p);

  const collapsedWidthPx = 56 - 24; // adjust? keep 32
  const sidebarCollapsedWidth = 32; // w-8
  const sidebarExpandedWidth = 176; // w-44
  const headerHeight = 48; // compact header height (was 56)
  const sidebarWidth = isSidebarCollapsed ? sidebarCollapsedWidth : sidebarExpandedWidth;

  const logoImg = import.meta.env.VITE_TAE_LOGO;

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-text-main text-xs">
      {/* Sidebar full height */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-surface/40 backdrop-blur-md border-r border-gray-700/80 shadow-2xl transition-all duration-500 ease-in-out ${
          isSidebarCollapsed ? "w-10" : "w-44"
        }`}
      >
        {/* Toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute top-2 right-0 translate-x-full bg-surface/80 backdrop-blur-md border border-gray-700/40 rounded-r-md p-1 hover:bg-gray-700/60 transition-all duration-300 shadow-md"
        >
          {isSidebarCollapsed ? (
            <ChevronRight size={16} className="text-white" />
          ) : (
            <ChevronLeft size={16} className="text-white" />
          )}
        </button>

        {/* Brand */}
        <div className="px-2 pt-4 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex-none w-6 h-6 rounded-md overflow-hidden bg-primary/40 flex items-center justify-center">
              {logoImg ? (
                <img src={logoImg} alt="TAE" className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary font-bold text-[9px] leading-none">TAE</span>
              )}
            </div>
            <span
              className={`text-white font-bold text-[10px] tracking-wide transition-all duration-300 overflow-hidden whitespace-nowrap ${
                isSidebarCollapsed ? "max-w-0 opacity-0" : "max-w-[140px] opacity-100"
              }`}
            >
              The Abel Experience™ CFW
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow space-y-3 overflow-y-auto scrollbar-hide px-1 pb-2">
          {/* Main */}
          <div>
            <p
              className={`px-1 text-[10px] font-semibold text-text-tertiary uppercase mb-1 transition-all ${
                isSidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-1"
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
              <NavItem to="/pokedex" icon={Image} isCollapsed={isSidebarCollapsed}>
                Pokédex
              </NavItem>
              <NavItem to="/shop" icon={Store} isCollapsed={isSidebarCollapsed}>
                Shop
              </NavItem>
              <NavItem to="/collections" icon={Boxes} isCollapsed={isSidebarCollapsed}>
                Collections
              </NavItem>
              <NavItem to="/tasks" icon={Clapperboard} isCollapsed={isSidebarCollapsed}>
                Tasks
              </NavItem>
              <NavItem to="/finance" icon={DollarSign} isCollapsed={isSidebarCollapsed}>
                Finance
              </NavItem>
              <NavItem to="/spotify-stats" icon={Music} isCollapsed={isSidebarCollapsed}>
                Spotify Stats
              </NavItem>
            </ul>
          </div>
          {/* Trackers */}
          <div>
            <p
              className={`px-1 text-[10px] font-semibold text-text-tertiary uppercase mb-1 transition-all ${
                isSidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-1"
              }`}
            >
              Trackers
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
          {/* Admin */}
          {user?.role === "admin" && (
            <div>
              <p
                className={`px-1 text-[10px] font-semibold text-text-tertiary uppercase mb-1 transition-all ${
                  isSidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-1"
                }`}
              >
                Admin
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
                <NavItem to="/admin/pokemon-editor" icon={PenSquare} isCollapsed={isSidebarCollapsed}>
                  Pokémon Editor
                </NavItem>
                <NavItem to="/admin/habbo-rares" icon={Boxes} isCollapsed={isSidebarCollapsed}>
                  Habbo Rare Editor
                </NavItem>
                <NavItem to="/settings" icon={Settings2} isCollapsed={isSidebarCollapsed}>
                  Settings
                </NavItem>
                <NavItem to="/admin/volume-workbench" icon={FileSignature} isCollapsed={isSidebarCollapsed}>
                  Volume Workbench
                </NavItem>
                <NavItem to="/admin/volumes" icon={Library} isCollapsed={isSidebarCollapsed}>
                  Volume Administration
                </NavItem>
              </ul>
            </div>
          )}
        </nav>

        {/* Logout */}
        <div className="mt-auto flex-shrink-0 border-t border-gray-700/50 pt-2 px-1 pb-3">
          <button
            onClick={logout}
            className={`w-full flex items-center p-2 rounded-lg text-xs text-text-secondary hover:bg-red-800/50 hover:text-white transition-all duration-300 ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={14} className={isSidebarCollapsed ? "" : "mr-2"} />
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

      {/* Header offset by sidebar width */}
      <div
        className="fixed top-0 right-0 z-40 transition-[left,width] duration-500"
        style={{ left: sidebarWidth, height: headerHeight }}
      >
        <Header />
      </div>

      {/* Main content */}
      <main
        className="absolute overflow-hidden flex flex-col"
        style={{ left: sidebarWidth, top: headerHeight, right: 0, bottom: 0 }}
      >
        <div className="flex-1 overflow-y-auto scrollbar-hide p-2 lg:p-3 min-h-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
