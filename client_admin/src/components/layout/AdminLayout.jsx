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
  Trophy,
} from "lucide-react";

const NavItem = ({ to, icon: Icon, children, isCollapsed }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `group flex items-center rounded-lg transition-all duration-300 text-text-secondary hover:bg-gray-700/50 hover:text-white px-[9px] py-[7px] ${
            isActive ? "bg-primary/20 text-white shadow-lg" : ""
          }`
        }
      >
        <span className="flex-none w-[22px] flex items-center justify-center">
          <Icon size={16} />
        </span>
        <span
          className={`ml-1.5 overflow-hidden whitespace-nowrap transition-all duration-300 ${
            isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 text-[11px]"
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
  // Default: expanded on desktop (lg: >=1024px), collapsed on smaller screens
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024; // collapse on tablets/phones, expand on desktop by default
    }
    return false;
  });
  const toggleSidebar = () => setIsSidebarCollapsed((p) => !p);

  // ~20% size increase and align numeric width with Tailwind classes below
  const sidebarCollapsedWidth = 48; // w-12 (was ~40)
  const sidebarExpandedWidth = 208; // w-52 (was 176)
  const headerHeight = 48; // compact header height (was 56)
  const sidebarWidth = isSidebarCollapsed ? sidebarCollapsedWidth : sidebarExpandedWidth;

  const logoImg = import.meta.env.VITE_TAE_LOGO;

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-text-main text-xs">
      {/* Sidebar full height */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-surface/40 backdrop-blur-md border-r border-gray-700/80 shadow-2xl transition-all duration-500 ease-in-out ${
          isSidebarCollapsed ? "w-12" : "w-52"
        }`}
      >
        {/* Toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute top-2 right-0 translate-x-full bg-surface/80 backdrop-blur-md border border-gray-700/40 rounded-r-md p-1 hover:bg-gray-700/60 transition-all duration-300 shadow-md"
        >
          {isSidebarCollapsed ? (
            <ChevronRight size={18} className="text-white" />
          ) : (
            <ChevronLeft size={18} className="text-white" />
          )}
        </button>

        {/* Brand */}
        <div className="px-2 pt-4 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex-none w-[26px] h-[26px] rounded-md overflow-hidden bg-primary/40 flex items-center justify-center">
              {logoImg ? (
                <img src={logoImg} alt="TAE" className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary font-bold text-[9px] leading-none">TAE</span>
              )}
            </div>
            <span
              className={`text-white font-bold text-[10px] tracking-wide transition-all duration-300 overflow-hidden whitespace-nowrap ${
                isSidebarCollapsed ? "max-w-0 opacity-0" : "max-w-[144px] opacity-100"
              }`}
            >
              The Abel Experience™ CFW
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow space-y-3 overflow-y-auto scrollbar-hide px-1 pb-2">
          {/* Overview */}
          <div>
            <p
              className={`px-1 text-[10px] font-semibold text-text-tertiary uppercase mb-1 transition-all ${
                isSidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-1"
              }`}
            >
              Overview
            </p>
            <ul className="space-y-0.1">
              <NavItem to="/dashboard" icon={LayoutDashboard} isCollapsed={isSidebarCollapsed}>
                System Dashboard
              </NavItem>
              <NavItem to="/profile" icon={User} isCollapsed={isSidebarCollapsed}>
                Account Profile
              </NavItem>
              <NavItem to="/shop" icon={Store} isCollapsed={isSidebarCollapsed}>
                Storefront
              </NavItem>
            </ul>
          </div>

          {/* Productivity */}
          <div>
            <p
              className={`px-1 text-[10px] font-semibold text-text-tertiary uppercase mb-1 transition-all ${
                isSidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-1"
              }`}
            >
              Productivity
            </p>
            <ul className="space-y-0.1">
              <NavItem to="/tasks" icon={Clapperboard} isCollapsed={isSidebarCollapsed}>
                Task Administrator
              </NavItem>
              <NavItem to="/habits" icon={CheckSquare} isCollapsed={isSidebarCollapsed}>
                Habit Tracker
              </NavItem>
              <NavItem to="/books" icon={BookOpen} isCollapsed={isSidebarCollapsed}>
                Reading Log
              </NavItem>
              <NavItem to="/workouts" icon={Dumbbell} isCollapsed={isSidebarCollapsed}>
                Training Sessions
              </NavItem>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <p
              className={`px-1 text-[11px] font-semibold text-text-tertiary uppercase mb-1 transition-all ${
                isSidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-1"
              }`}
            >
              Collections
            </p>
            <ul className="space-y-0.1">
              <NavItem to="/collections" icon={Boxes} isCollapsed={isSidebarCollapsed}>
                Object Index
              </NavItem>
              <NavItem to="/pokedex" icon={Image} isCollapsed={isSidebarCollapsed}>
                Pokémon Index
              </NavItem>
            </ul>
          </div>

          {/* Finance */}
          <div>
            <p
              className={`px-1 text-[11px] font-semibold text-text-tertiary uppercase mb-1 transition-all ${
                isSidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-1"
              }`}
            >
              Finance
            </p>
            <ul className="space-y-0.1">
              <NavItem to="/finance" icon={DollarSign} isCollapsed={isSidebarCollapsed}>
                Console
              </NavItem>
              <NavItem to="/finance/rich" icon={DollarSign} isCollapsed={isSidebarCollapsed}>
                Dashboard
              </NavItem>
            </ul>
          </div>

          {/* Media */}
          <div>
            <p
              className={`px-1 text-[10px] font-semibold text-text-tertiary uppercase mb-1 transition-all ${
                isSidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-1"
              }`}
            >
              Media
            </p>
            <ul className="space-y-0.1">
              <NavItem to="/spotify-stats" icon={Music} isCollapsed={isSidebarCollapsed}>
                Spotify Analytics
              </NavItem>
            </ul>
          </div>

          {/* Sports */}
          <div>
            <p
              className={`px-1 text-[10px] font-semibold text-text-tertiary uppercase mb-1 transition-all ${
                isSidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-1"
              }`}
            >
              Sports
            </p>
            <ul className="space-y-0.1">
              <NavItem to="/football-tracker" icon={Trophy} isCollapsed={isSidebarCollapsed}>
                Football Tracker
              </NavItem>
            </ul>
          </div>

          {/* Admin */}
          {user?.role === "admin" && (
            <div className="space-y-0.1">
              {/* Admin: Content */}
              <div>
                <p
                  className={`px-1 text-[10px] font-semibold text-text-tertiary uppercase mb-1 transition-all ${
                    isSidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-1"
                  }`}
                >
                  Volume Administration
                </p>
                <ul className="space-y-1">
                  <NavItem to="/admin/volumes" icon={Library} isCollapsed={isSidebarCollapsed}>
                    JSON Parser
                  </NavItem>
                  <NavItem to="/admin/volume-workbench" icon={FileSignature} isCollapsed={isSidebarCollapsed}>
                    Workbench
                  </NavItem>
                  <NavItem to="/admin/blessings" icon={ClipboardList} isCollapsed={isSidebarCollapsed}>
                    Blessings Library
                  </NavItem>
                  <p
                    className={`px-1 text-[10px] font-semibold text-text-tertiary uppercase mb-1 transition-all ${
                      isSidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-1"
                    }`}
                  >
                    Digital Asset Administration
                  </p>
                  <NavItem to="/admin/pokemon-editor" icon={PenSquare} isCollapsed={isSidebarCollapsed}>
                    Pokémon Data Manager
                  </NavItem>
                  <NavItem to="/admin/habbo-rares" icon={Boxes} isCollapsed={isSidebarCollapsed}>
                    Habbo Rares Manager
                  </NavItem>
                </ul>
              </div>
              {/* Admin: Fitness */}
              <div>
                <p
                  className={`px-1 text-[10px] font-semibold text-text-tertiary uppercase mb-1 transition-all ${
                    isSidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-1"
                  }`}
                >
                  Activity Tracking
                </p>
                <ul className="space-y-0.1">
                  <NavItem to="/admin/exercises" icon={Settings} isCollapsed={isSidebarCollapsed}>
                    Exercise Schema
                  </NavItem>
                  <NavItem to="/admin/templates" icon={Settings} isCollapsed={isSidebarCollapsed}>
                    Workout Templates
                  </NavItem>
                </ul>
              </div>

              {/* Admin: System */}
              <div>
                <p
                  className={`px-1 text-[10px] font-semibold text-text-tertiary uppercase mb-1 transition-all ${
                    isSidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-1"
                  }`}
                >
                  System
                </p>
                <ul className="space-y-1">
                  <NavItem to="/admin/users" icon={Users} isCollapsed={isSidebarCollapsed}>
                    User Directory Admin
                  </NavItem>
                </ul>
                <ul className="space-y-1">
                  <NavItem to="/settings" icon={Settings2} isCollapsed={isSidebarCollapsed}>
                    System Settings
                  </NavItem>
                </ul>
              </div>
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
