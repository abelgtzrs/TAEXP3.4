import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

// UI Components
import PageHeader from "../components/ui/PageHeader";

// Dashboard Widgets
import StatBoxRow from "../components/dashboard/StatBoxRow";
import StatBox from "../components/dashboard/StatBox";
import LoreChartWidget from "../components/dashboard/LoreChartWidget";
import SecuritySettingsWidget from "../components/dashboard/SecuritySettingsWidget";
import CurrencySourceWidget from "../components/dashboard/CurrencySourceWidget";
import GoalsWidget from "../components/dashboard/GoalsWidget";
import RecentAcquisitionsWidget from "../components/dashboard/RecentAcquisitionsWidget";
import SpotifyWidget from "../components/dashboard/SpotifyWidget";
import TopProductsWidget from "../components/dashboard/TopProductsWidget";
import HabitTrackerWidget from "../components/dashboard/HabitTrackerWidget";
import BookTrackerWidget from "../components/dashboard/BookTrackerWidget";
import WorkoutTrackerWidget from "../components/dashboard/WorkoutTrackerWidget";
import ClockWidget from "../components/dashboard/ClockWidget";
import WeatherWidget from "../components/dashboard/WeatherWidget";
import PersonaWidget from "../components/dashboard/PersonaWidget";
import CalendarWidget from "../components/dashboard/CalendarWidget";
import StrokesLyricsWidget from "../components/dashboard/StrokesLyricsWidget";

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [streakStatus, setStreakStatus] = useState({ countedToday: true, currentLoginStreak: 0 });
  const [ticking, setTicking] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  // Team popover moved to global Header; local state removed

  // Resolve server base for images
  const serverBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").split("/api")[0];

  const getPokemonSprite = (basePokemon) => {
    if (!basePokemon) return null;
    const firstForm = basePokemon.forms?.[0];
    const sprite = firstForm?.spriteGen6Animated || firstForm?.spriteGen5Animated || null;
    return sprite ? `${serverBaseUrl}${sprite}` : null;
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, streakRes] = await Promise.all([
          api.get("/users/me/dashboard-stats"),
          api.get("/users/me/streak/status"),
        ]);
        setStats(statsRes.data.data);
        setStreakStatus(streakRes.data.data);
        // If the new day started (per backend status), prompt via modal
        setShowStreakModal(!streakRes.data?.data?.countedToday);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleTickStreak = async () => {
    try {
      setTicking(true);
      const res = await api.post("/users/me/streak/tick");
      const data = res.data?.data || {};
      setStreakStatus((prev) => ({ ...prev, ...data }));
      setShowStreakModal(false);
      // Refresh dashboard stats to reflect new streak immediately
      const statsRes = await api.get("/users/me/dashboard-stats");
      setStats(statsRes.data.data);
    } catch (err) {
      console.error("Failed to tick streak:", err);
    } finally {
      setTicking(false);
    }
  };

  // --- Midnight (America/New_York) refresh scheduler ---
  // Utility: extract current NY time parts using Intl (handles EST/EDT automatically)
  const getNYParts = () => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
    const hour = parseInt(parts.hour || "0", 10);
    const minute = parseInt(parts.minute || "0", 10);
    const second = parseInt(parts.second || "0", 10);
    return { hour, minute, second };
  };

  const msUntilNextNYMidnight = () => {
    const { hour, minute, second } = getNYParts();
    const secondsToday = hour * 3600 + minute * 60 + second;
    const remaining = 24 * 3600 - secondsToday;
    // add a small buffer to cross the boundary safely
    return Math.max(remaining * 1000 + 500, 1000);
  };

  // Schedule a refresh at 0:00 America/New_York and show the modal if needed
  useEffect(() => {
    let timerId = setTimeout(async function midnightTick() {
      try {
        const streakRes = await api.get("/users/me/streak/status");
        setStreakStatus(streakRes.data.data);
        setShowStreakModal(!streakRes.data?.data?.countedToday);
      } catch (e) {
        console.error("Midnight streak refresh failed:", e);
      } finally {
        // schedule the next midnight tick again
        timerId = setTimeout(midnightTick, msUntilNextNYMidnight());
      }
    }, msUntilNextNYMidnight());

    return () => clearTimeout(timerId);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-3"
      style={{ zoom: "0.75", transformOrigin: "top left" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <PageHeader
          title="Dashboard"
          subtitle={`Cognitive Framework Status for ${user.username || "Admin"}.`}
          className="mt-1 mb-1 pl-4"
        />
        {/* Current streak hint below header */}
        {!loading && (
          <div className="px-4 text-xs opacity-70">Current streak: {streakStatus.currentLoginStreak || 0}</div>
        )}
      </motion.div>

      {/* --- Main Dashboard Grid --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-8 gap-4 -mt-1"
      >
        {/* Row 1: Full-width Stat Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="col-span-8 order-1 md:order-1"
        >
          <div className="grid grid-cols-2 gap-2 w-full md:grid-cols-8 md:gap-4 auto-rows-fr">
            {Array.isArray(stats.statBoxes) ? (
              stats.statBoxes.map((stat, idx) => (
                <div key={stat.id || idx} className="w-full h-full">
                  <StatBox stat={stat} loading={loading} className="w-full h-full" />
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <StatBoxRow stats={stats} loading={loading} />
              </div>
            )}
          </div>
        </motion.div>

        {/* --- Precise Widget Placement --- */}

        {/* Calendar - Top left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="col-span-8 md:col-span-2 order-3 md:order-3"
        >
          <CalendarWidget />
        </motion.div>

        {/* Clock - Top right */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="col-span-8 md:col-span-2 order-2 md:order-4 row-span-1"
        >
          <ClockWidget />
        </motion.div>

        {/* Habit Tracker - Bottom left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="col-span-8 md:col-span-2 order-5 md:order-5 row-span-2"
        >
          <HabitTrackerWidget />
        </motion.div>

        {/* Weather - Bottom right */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="col-span-8 md:col-span-2 order-4 md:order-6"
        >
          <WeatherWidget />
        </motion.div>

        {/* Workout Tracker - Fifth widget in mobile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="col-span-4 md:col-span-2 order-6 md:order-7 row-span-2"
        >
          <WorkoutTrackerWidget />
        </motion.div>

        {/* Charts - Last widget in mobile, first in desktop */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          className="col-span-8 md:col-span-4 order-7 md:order-2 overflow-hidden"
        >
          <div className="w-full aspect-square overflow-hidden">
            <LoreChartWidget />
          </div>
        </motion.div>

        {/* Book Tracker - 2 columns, stacked below habit tracker */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="col-span-8 md:col-span-2 order-8 md:order-8 row-span-1"
        >
          <BookTrackerWidget />
        </motion.div>

        {/* The rest of the widgets filling the remaining space */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="col-span-8 md:col-span-4 lg:col-span-2 order-9 md:order-9 row-span-2"
        >
          <StrokesLyricsWidget />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="col-span-6 md:col-span-3 lg:col-span-2 row-span-2"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="col-span-8 md:col-span-4 lg:col-span-2 order-10 md:order-10 row-span-2"
        >
          <SpotifyWidget />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="col-span-8 md:col-span-4 lg:col-span-2 order-11 md:order-11 row-span-2"
        >
          <SecuritySettingsWidget />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.7 }}
          className="col-span-8 lg:col-span-2 order-12 md:order-12 row-span-2"
        >
          <GoalsWidget goals={stats.goals} loading={loading} />
        </motion.div>
        {/* Additional Widgets */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="col-span-8 md:col-span-4 lg:col-span-2 order-12 md:order-12 row-span-2"
        >
          <RecentAcquisitionsWidget acquisitions={stats.recentAcquisitions} loading={loading} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.9 }}
          className="col-span-8 md:col-span-4 lg:col-span-2 order-12 md:order-12 row-span-2"
        >
          <TopProductsWidget products={stats.topProducts} loading={loading} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 2.0 }}
          className="col-span-8 md:col-span-4 lg:col-span-2 order-12 md:order-12 row-span-2"
        >
          <CurrencySourceWidget />
        </motion.div>
      </motion.div>

      {/* Streak Modal (appears at 0:00 America/New_York if not yet counted) */}
      {showStreakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowStreakModal(false)} />
          <div className="relative z-10 widget-container rounded-xl p-6 w-[92%] max-w-md border border-white/10">
            <h3 className="text-lg font-semibold text-white">New Day! Count Your Login</h3>
            <p className="mt-2 text-sm text-slate-300">
              It just turned 12:00 AM (New York). Count today’s login to continue your streak.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleTickStreak}
                disabled={ticking}
                className="inline-flex items-center gap-2 rounded-md bg-emerald-600 text-white px-4 py-2 text-sm hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed shadow"
                title="Count today's login toward your streak"
              >
                {ticking ? "Updating…" : "Count today’s login"}
              </button>
              <button
                onClick={() => setShowStreakModal(false)}
                className="inline-flex items-center gap-2 rounded-md bg-white/10 text-white px-3 py-2 text-sm hover:bg-white/15 border border-white/10"
              >
                Not now
              </button>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Current streak: {streakStatus.currentLoginStreak || 0}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardPage;
