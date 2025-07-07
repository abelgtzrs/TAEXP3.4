import { Search, Bell, Mail, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-surface/80 backdrop-blur-md border-b border-gray-700/50 p-1.5 flex items-center justify-between sticky top-0 z-40">
      {/* Left Side: Can be used for a sidebar toggle or breadcrumbs */}
      <div className="w-1/4">{/* Placeholder */}</div>

      {/* Center: Global Search Bar */}
      <div className="w-1/2 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="search"
            placeholder="Search anything..."
            className="w-full bg-background/50 border border-gray-700 text-text-main placeholder-text-secondary rounded-md py-1.5 pl-8 pr-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all duration-300"
          />
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Search size={14} className="text-text-secondary" />
          </div>
        </div>
      </div>

      {/* Right Side: Action Icons and User Profile */}
      <div className="w-1/4 flex items-center justify-end space-x-3">
        <button className="p-1.5 rounded-full text-text-secondary hover:bg-gray-700/50 hover:text-primary transition-colors">
          <Bell size={16} />
        </button>
        <button className="p-1.5 rounded-full text-text-secondary hover:bg-gray-700/50 hover:text-primary transition-colors">
          <Mail size={16} />
        </button>

        <div className="h-5 w-px bg-gray-700"></div>

        <div className="relative group">
          <button className="flex items-center space-x-2 text-text-secondary hover:text-white">
            <User size={16} />
            <span className="text-xs font-medium hidden md:block">{user?.username || "User"}</span>
          </button>
          <div className="absolute right-0 mt-2 w-40 bg-surface border border-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible z-50">
            <div className="py-1">
              <Link
                to="/profile"
                className="flex items-center w-full text-left px-3 py-1.5 text-xs text-text-secondary hover:bg-gray-700 hover:text-white"
              >
                <User size={14} className="mr-2" />
                Profile
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center px-3 py-1.5 text-xs text-status-danger/80 hover:bg-gray-700 hover:text-status-danger"
              >
                <LogOut size={14} className="mr-2" />
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
