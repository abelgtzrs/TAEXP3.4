import { Search, Bell, Mail, User, LogOut, PanelLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Header = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-surface/80 backdrop-blur-md border-b border-gray-700/50 p-4 flex items-center justify-between sticky top-0 z-40">
      {/* Left Side: Sidebar Toggle Button */}
      <div className="w-1/4">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="p-2 rounded-full text-text-secondary hover:bg-gray-700/50 hover:text-primary transition-colors"
        >
          <PanelLeft size={20} />
        </button>
      </div>

      {/* Center: Global Search Bar */}
      <div className="w-1/2 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="search"
            placeholder="Search anything..."
            className="w-full bg-background/50 border border-gray-700 text-text-main placeholder-text-secondary rounded-md py-2 pl-10 pr-4 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all duration-300"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-text-secondary" />
          </div>
        </div>
      </div>

      {/* Right Side: Action Icons and User Profile */}
      <div className="w-1/4 flex items-center justify-end space-x-4">
        <button className="p-2 rounded-full text-text-secondary hover:bg-gray-700/50 hover:text-primary transition-colors">
          <Bell size={20} />
        </button>
        <button className="p-2 rounded-full text-text-secondary hover:bg-gray-700/50 hover:text-primary transition-colors">
          <Mail size={20} />
        </button>

        <div className="h-6 w-px bg-gray-700"></div>

        <div className="relative group">
          <button className="flex items-center space-x-2 text-text-secondary hover:text-white">
            <User size={20} />
            <span className="text-sm font-medium hidden md:block">{user?.email || "User"}</span>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-surface border border-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible z-50">
            <div className="py-1">
              <Link
                to="/profile"
                className="flex items-center w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-gray-700 hover:text-white"
              >
                <User size={16} className="mr-2" />
                Profile
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-2 text-sm text-status-danger/80 hover:bg-gray-700 hover:text-status-danger"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
