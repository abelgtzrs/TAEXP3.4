import { Search, Bell, Mail, User, LogOut, CalendarDays } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { Link } from "react-router-dom";
import CalendarWidget from "../dashboard/CalendarWidget";

const Header = ({ forcedHeight }) => {
  const { user, logout, setUser } = useAuth();
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);
  const personaButtonRef = useRef(null);
  const [showTeamSprites, setShowTeamSprites] = useState(() => {
    try {
      const raw = localStorage.getItem("tae.header.showTeamSprites");
      return raw ? JSON.parse(raw) === true : false;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("tae.header.showTeamSprites", JSON.stringify(!!showTeamSprites));
    } catch {}
  }, [showTeamSprites]);
  const teamHoverTimer = useRef(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarHoverTimer = useRef(null);
  const unlockedPersonas = user?.unlockedAbelPersonas || [];
  const activePersona = user?.activeAbelPersona || null;
  const activePersonaId = activePersona?._id || null;

  // Construct the base URL for the server to correctly resolve image paths
  const serverBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").split("/api")[0];

  const getPokemonSprite = (basePokemon) => {
    if (!basePokemon) return null;
    const firstForm = basePokemon.forms?.[0];
    // Use Gen5 animated sprite specifically for header display
    const sprite = firstForm?.spriteGen5Animated || null;
    return sprite ? `${serverBaseUrl}${sprite}` : null;
  };

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

  // Expand header to 112px when showing team to push page content down
  const computedHeight = forcedHeight ? forcedHeight : showTeamSprites ? 112 : 48;

  // Moving sprites state/logic
  const spriteSize = showTeamSprites ? 72 : 36; // 50% smaller when header is contracted
  const containerRef = useRef(null);
  const rafRef = useRef(0);
  const [actors, setActors] = useState([]);
  const mailButtonRef = useRef(null);

  // Initialize and run animation regardless of header expansion; size/wall adapt via state
  useEffect(() => {
    const team = (user?.displayedPokemon || []).slice(0, 6);
    const el = containerRef.current;
    if (!el || team.length === 0) return;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Distribute actors across vertical lanes to avoid all hugging the bottom/top
    const padding = 8; // keep off exact edges for nicer look
    const usableH = Math.max(height - spriteSize - padding * 2, 0);
    const laneCount = Math.max(team.length, 1);
    const laneStep = laneCount > 1 ? usableH / (laneCount - 1) : 0;
    const init = team.map((p, i) => {
      const x = Math.random() * Math.max(width - spriteSize, 0);
      // Evenly spaced lanes with a tiny jitter
      let baseY = padding + i * laneStep;
      const jitter = (Math.random() - 0.5) * 12; // +/- 6px
      let y = Math.min(Math.max(baseY + jitter, 0), Math.max(height - spriteSize, 0));
      const speed = 0.6 + Math.random() * 1.0; // px per frame
      const dir = Math.random() < 0.5 ? -1 : 1; // start left or right
      const vx = dir * speed;
      const vy = 0; // horizontal-only movement
      return { key: p?._id || p?.basePokemon?._id || `${i}`, x, y, vx, vy };
    });
    setActors(init);

    let lastTs = performance.now();
    const step = (ts) => {
      const dt = Math.min((ts - lastTs) / (1000 / 60), 2); // normalize to ~60fps steps, cap to avoid jumps
      lastTs = ts;
      setActors((prev) => {
        if (!el) return prev;
        const { width: w, height: h, left: contLeft } = el.getBoundingClientRect();
        // Determine right boundary; place a wall just to the left of the Mail icon (not the button edge)
        let rightLimit = w - spriteSize;
        if (mailButtonRef.current) {
          const mailRect = mailButtonRef.current.getBoundingClientRect();
          const iconSize = 16; // Mail icon size in px
          const iconLeftInContainer = mailRect.left - contLeft + (mailRect.width - iconSize) / 2;
          const wallX = iconLeftInContainer - 2; // small 2px gap before the icon
          rightLimit = Math.min(rightLimit, Math.max(wallX - spriteSize, 0));
        }
        const next = prev.map((a) => ({ ...a }));

        // Integrate motion (horizontal only)
        for (const a of next) {
          a.x += a.vx * dt;

          // Bounds with bounce (left/right)
          if (a.x < 0) {
            a.x = 0;
            a.vx = Math.abs(a.vx);
          } else if (a.x > rightLimit) {
            a.x = Math.max(rightLimit, 0);
            a.vx = -Math.abs(a.vx);
          }

          // Keep Y within bounds (no vertical motion, just clamp with padding)
          const pad = 8;
          if (a.y < pad) a.y = pad;
          if (a.y > h - spriteSize - pad) a.y = Math.max(h - spriteSize - pad, 0);
        }
        // Allow overlapping — no separation logic
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTeamSprites, user?.displayedPokemon]);
  return (
    <header
      className="relative bg-black/20 backdrop-blur-xl border-b border-white/10 px-3 py-1.5 flex items-center justify-between sticky top-0 z-40 shadow-2xl shadow-black/50 transition-[height] duration-300 ease-out"
      style={{ height: computedHeight }}
    >
      {/* Left Side: Logo/Brand */}
      <div className="flex items-center">
        <div className="flex items-center space-x-2">
          <div className="hidden sm:block">
            <h1 className="text-white/90 font-bold text-base tracking-tight leading-tight"></h1>
            <p className="text-white/40 text-[10px] font-medium -mt-0.5"></p>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar (hidden on very small screens) */}
      <div className="hidden xs:flex justify-center flex-1 mx-3 sm:mx-6">
        <div className="relative w-full max-w-md">
          <input
            type="search"
            placeholder="Search..."
            className="w-full bg-black/30 backdrop-blur-sm border border-white/20 text-white/90 placeholder-white/40 rounded-2xl py-2 pl-9 pr-4 focus:ring-2 focus:ring-primary/40 focus:border-primary/40 focus:outline-none transition-all duration-300 hover:bg-black/40 focus:bg-black/40 shadow-inner text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-white/50" />
          </div>
        </div>
      </div>

      {/* Right Side: Action Icons and User Profile */}
      <div className="flex items-center space-x-2">
        <button
          ref={mailButtonRef}
          className="p-2 rounded-xl text-white/60 hover:bg-white/10 hover:text-primary transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Mail size={16} />
        </button>
        {/* Team toggle - Poké Ball icon */}
        <button
          type="button"
          aria-pressed={showTeamSprites}
          onClick={() => setShowTeamSprites((v) => !v)}
          title={showTeamSprites ? "Hide Pokémon team" : "Show Pokémon team in header"}
          className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
            showTeamSprites
              ? "bg-primary/20 text-primary hover:bg-primary/30"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          {/* Pokéball icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 3a9 9 0 0 0-8.485 6h4.146a4.5 4.5 0 0 1 8.678 0h4.146A9 9 0 0 0 12 3Zm0 18a9 9 0 0 0 8.485-6h-4.146a4.5 4.5 0 0 1-8.678 0H3.515A9 9 0 0 0 12 21Zm0-12a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
              fill="currentColor"
            />
          </svg>
        </button>
        {/* Calendar icon and popover - placed to the right of the Pokémon icon */}
        <div
          className="relative"
          onMouseEnter={() => {
            if (calendarHoverTimer.current) {
              clearTimeout(calendarHoverTimer.current);
              calendarHoverTimer.current = null;
            }
            setCalendarOpen(true);
          }}
          onMouseLeave={() => {
            calendarHoverTimer.current = setTimeout(() => setCalendarOpen(false), 120);
          }}
        >
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={calendarOpen}
            onClick={() => setCalendarOpen((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setCalendarOpen(false);
            }}
            title="Show calendar"
            className="p-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <CalendarDays size={16} />
          </button>
          {calendarOpen && (
            <div
              role="dialog"
              aria-label="Calendar"
              className="absolute right-0 mt-2 z-50 w-[380px] max-h-[520px] overflow-y-auto"
              onMouseEnter={() => {
                if (calendarHoverTimer.current) {
                  clearTimeout(calendarHoverTimer.current);
                  calendarHoverTimer.current = null;
                }
                setCalendarOpen(true);
              }}
              onMouseLeave={() => {
                calendarHoverTimer.current = setTimeout(() => setCalendarOpen(false), 120);
              }}
            >
              {/* Using the full CalendarWidget inside a lightweight container */}
              <div className="rounded-xl bg-black/85 backdrop-blur-xl border border-white/15 shadow-2xl p-2">
                <CalendarWidget />
              </div>
            </div>
          )}
        </div>
        <div className="h-6 w-px bg-white/15"></div>
        <div
          className="relative group"
          onMouseEnter={() => setPersonaDropdownOpen(true)}
          onMouseLeave={() => setPersonaDropdownOpen(false)}
        >
          <button
            ref={personaButtonRef}
            className="flex items-center space-x-2 px-2 py-1 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9">
              <img
                src={
                  user?.profilePicture
                    ? `${serverBaseUrl}${user.profilePicture}`
                    : `https://api.dicebear.com/8.x/pixel-art/svg?seed=${user?.username || "user"}`
                }
                alt="User Avatar"
                className="w-full h-full rounded-full object-cover border border-primary/40 shadow-md shadow-primary/20 ring-1 ring-primary/10"
                style={{ filter: "drop-shadow(0 0 4px rgba(45, 212, 191, 0.25))" }}
              />
            </div>
            <div className="hidden md:block text-left leading-tight">
              <span className="text-xs font-medium block -mb-0.5">{user?.username || "User"}</span>
              <span className="text-[10px] text-white/40">Admin</span>
            </div>
          </button>
          <div
            className={`absolute right-0 mt-2 w-56 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden transition-all duration-300 ${
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
      {/* Full-header field with freely moving Pokémon team (always visible; horizontal only, overlapping; mirror on right) */}
      <div ref={containerRef} className="pointer-events-none absolute inset-0" style={{ height: "100%" }}>
        {/* Render sprites positioned absolutely within the field */}
        <div className="relative w-full h-full">
          {(user?.displayedPokemon || []).slice(0, 6).map((p, idx) => {
            const base = p?.basePokemon;
            const sprite = getPokemonSprite(base);
            if (!sprite) return null;
            const actor = actors[idx];
            const x = actor?.x ?? 0;
            const y = actor?.y ?? 0;
            const vx = actor?.vx ?? 0.8;
            const mirrorOnRight = vx > 0; // mirror when moving right
            return (
              <img
                key={actor?.key || p?._id || base?._id || idx}
                src={sprite}
                alt={base?.name || "Pokemon"}
                height={spriteSize}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  height: spriteSize,
                  width: "auto",
                  transform: mirrorOnRight ? "scaleX(-1)" : "none",
                  transformOrigin: "center",
                  imageRendering: "auto",
                  filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))",
                }}
              />
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
