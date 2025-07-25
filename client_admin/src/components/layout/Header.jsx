import { Search, Bell, Mail, User, LogOut } from "lucide-react";
import { useState, useRef } from "react";
// ...existing code...
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, logout, setUser } = useAuth();
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);
  const personaButtonRef = useRef(null);
  const unlockedPersonas = user?.unlockedAbelPersonas || [];
  const activePersona = user?.activeAbelPersona || null;
  const activePersonaId = activePersona?._id || null;

  // Construct the base URL for the server to correctly resolve image paths
  const serverBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").split("/api")[0];

  const handleSelectPersona = async (personaId) => {
    if (personaId === activePersonaId) {
      setPersonaDropdownOpen(false);
      return;
    }
    try {
      const response = await api.put("/users/me/profile/active-persona", { personaId });
      setUser(response.data.data);
      setPersonaDropdownOpen(false);
    } catch (error) {
      alert("Could not set active persona.");
    }
  };

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

        <div
          className="relative group"
          onMouseEnter={() => setPersonaDropdownOpen(true)}
          onMouseLeave={() => setPersonaDropdownOpen(false)}
        >
          <button
            ref={personaButtonRef}
            className="flex items-center space-x-3 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <div className="relative w-12 h-12">
              <img
                src={
                  user?.profilePicture
                    ? `${serverBaseUrl}${user.profilePicture}`
                    : `https://api.dicebear.com/8.x/pixel-art/svg?seed=${user?.username || "user"}`
                }
                alt="User Avatar"
                className="w-full h-full rounded-full object-cover border-2 border-primary/50 shadow-lg shadow-primary/30 ring-2 ring-primary/20"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(45, 212, 191, 0.3))",
                }}
              />
            </div>
            <div className="hidden md:block text-left">
              <span className="text-sm font-medium block">{user?.username || "User"}</span>
              <span className="text-xs text-white/40">Admin</span>
            </div>
          </button>
          <div
            className={`absolute right-0 mt-3 w-56 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden transition-all duration-300 ${
              personaDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            <div className="py-2">
              {/* Persona Selector Dropdown */}
              <div className="border-b border-white/10 pb-2 mb-2">
                <div className="px-4 py-2 text-xs text-white/60 font-semibold">Persona Selector</div>
                <button
                  onClick={() => handleSelectPersona(null)}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-all duration-200 border-b border-gray-700 last:border-b-0 ${
                    !activePersonaId ? "bg-primary/20" : ""
                  }`}
                >
                  <span className="text-sm font-bold text-text-main">Standard Issue</span>
                  {!activePersonaId && <span className="text-primary text-xs ml-2">●</span>}
                </button>
                {unlockedPersonas.map((persona) => {
                  const isActive = activePersonaId === persona._id;
                  return (
                    <button
                      key={persona._id}
                      onClick={() => handleSelectPersona(persona._id)}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-all duration-200 border-b border-gray-700 last:border-b-0 ${
                        isActive ? "bg-opacity-20" : ""
                      }`}
                      style={{ backgroundColor: isActive ? `${persona.colors?.primary}20` : "" }}
                    >
                      <span className="text-sm font-bold text-text-main">{persona.name}</span>
                      {isActive && (
                        <span className="text-xs ml-2" style={{ color: persona.colors?.primary || "#2DD4BF" }}>
                          ●
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
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
