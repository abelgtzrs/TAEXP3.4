// --- FILE: client-admin/src/pages/DashboardPage.jsx (Corrected) ---

import { useState, useEffect } from "react"; // <-- THIS IS THE FIX
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import MetricCard from "../components/dashboard/MetricCard";
import LoreChartWidget from "../components/dashboard/LoreChartWidget";
import SystemStatusWidget from "../components/dashboard/SystemStatusWidget";
import CurrencySourceWidget from "../components/dashboard/CurrencySourceWidget";
import GoalsWidget from "../components/dashboard/GoalsWidget";
import RecentAcquisitionsWidget from "../components/dashboard/RecentAcquisitionsWidget";

const DashboardPage = () => {
  // Get the base user object from context
  const { user } = useAuth();

  // State for our dynamic stats, now with useState correctly imported
  const [stats, setStats] = useState({
    habitsCompleted: 0,
    booksFinished: 0,
    gachaPulls: 0,
    activeStreaks: 0,
  });
  const [loading, setLoading] = useState(true);

  // useEffect hook to fetch data when the page loads
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get("/users/me/dashboard-stats");
        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        // In case of error, the stats will just remain at their default '0' values
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []); // Empty array ensures this runs only once on mount

  return (
    <div>
      {/* --- Main Header --- */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome back, {user?.email || "Admin"}.</h1>
        <p className="text-gray-400">Here is the current status of the Experience.</p>
      </div>

      {/* --- Main Grid Layout (12 columns) --- */}
      <div className="grid grid-cols-12 gap-6">
        {/* Top Row: Metric Cards - Now with dynamic data */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <MetricCard
            title="Habits Completed Today"
            value={loading ? "..." : stats.habitsCompleted}
            change=""
            changeType="increase"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <MetricCard
            title="Books Finished"
            value={loading ? "..." : stats.booksFinished}
            change=""
            changeType="increase"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <MetricCard
            title="Total Collectibles"
            value={loading ? "..." : stats.gachaPulls}
            change=""
            changeType="increase"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <MetricCard
            title="Login Streak"
            value={loading ? "..." : stats.activeStreaks}
            change=""
            changeType="increase"
          />
        </div>

        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <LoreChartWidget />
          <RecentAcquisitionsWidget />
        </div>

        {/* Right Sidebar Area */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <SystemStatusWidget />
          <CurrencySourceWidget />
          <GoalsWidget />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
