import { Search, Bell, Mail, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom"; // Import Link for the profile link

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800/70 backdrop-blur-md border-b border-gray-700/50 p-4 flex items-center justify-between sticky top-0 z-40">
      {/* Left Side Placeholder */}
      <div className="w-1/4"></div>

      {/* Center: Global Search Bar */}
      <div className="w-1/2 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="search"
            placeholder="Search anything..."
            className="w-full bg-gray-900/50 border border-gray-700 text-gray-300 placeholder-gray-500 rounded-md py-2 pl-10 pr-4 focus:ring-1 focus:ring-teal-400 focus:border-teal-400 focus:outline-none transition-all duration-300"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500" />
          </div>
        </div>
      </div>

      {/* Right Side: Action Icons and User Profile */}
      <div className="w-1/4 flex items-center justify-end space-x-4">
        <button className="p-2 rounded-full text-gray-400 hover:bg-gray-700/50 hover:text-teal-400 transition-colors">
          <Bell size={20} />
        </button>
        <button className="p-2 rounded-full text-gray-400 hover:bg-gray-700/50 hover:text-teal-400 transition-colors">
          <Mail size={20} />
        </button>

        <div className="h-6 w-px bg-gray-700"></div>

        <div className="relative group">
          <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <User size={20} />
            <span className="text-sm font-medium hidden md:block">
              {user?.email || "User"}
            </span>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible">
            <div className="py-1">
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                <User size={16} className="mr-2" />
                Profile
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
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
