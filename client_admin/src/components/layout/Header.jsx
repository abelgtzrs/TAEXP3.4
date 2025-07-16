import { Search, Bell, Mail, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-2xl shadow-black/50">
      {/* Left Side: Logo/Brand */}
      <div className="flex items-center">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/20">
            <span className="text-primary font-bold text-lg tracking-wider">AE</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-white/90 font-bold text-xl tracking-tight">taexp.cfw</h1>
            <p className="text-white/40 text-xs font-medium">Genesis Dashboard</p>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex justify-center flex-1 mx-8">
        <div className="relative w-full max-w-lg">
          <input
            type="search"
            placeholder="Search collections, items, stats..."
            className="w-full bg-black/30 backdrop-blur-sm border border-white/20 text-white/90 placeholder-white/40 rounded-2xl py-3 pl-12 pr-6 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:outline-none transition-all duration-300 hover:bg-black/40 focus:bg-black/40 shadow-inner"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-white/50" />
          </div>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <kbd className="hidden md:inline-flex px-2 py-1 text-xs font-semibold text-white/40 bg-white/10 rounded border border-white/10">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Side: Action Icons and User Profile */}
      <div className="flex items-center space-x-3">
        <button className="p-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-primary transition-all duration-300 hover:scale-105 active:scale-95">
          <Mail size={20} />
        </button>

        <div className="h-8 w-px bg-white/20"></div>

        <div className="relative group">
          <button className="flex items-center space-x-3 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300">
            <div className="w-8 h-8 bg-gradient-to-br from-primary/40 to-primary/20 rounded-full flex items-center justify-center border border-primary/30">
              <User size={16} className="text-primary" />
            </div>
            <div className="hidden md:block text-left">
              <span className="text-sm font-medium block">{user?.username || "User"}</span>
              <span className="text-xs text-white/40">Admin</span>
            </div>
          </button>
          <div className="absolute right-0 mt-3 w-56 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 invisible group-hover:visible z-50 overflow-hidden">
            <div className="py-2">
              <Link
                to="/profile"
                className="flex items-center w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                <User size={16} className="mr-3 text-primary/80" />
                Profile Settings
              </Link>
              <div className="mx-4 my-2 h-px bg-white/10"></div>
              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-3 text-sm text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
              >
                <LogOut size={16} className="mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
