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
import SecuritySettingsWidget from "../components/dashboard/SecuritySettingsWidget";
import ThreatDetectionWidget from "../components/dashboard/ThreatDetectionWidget";
import Separator from "../components/ui/Separator";

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
    <div className="space-y-6">
      {/* Top Row: Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* We apply the new cut-corners style to these metric cards */}
        <MetricCard title="Habits Completed" value="74" className="widget-cut-corners" />
        <MetricCard title="Books Finished" value="8" className="widget-cut-corners" />
        <MetricCard title="Total Collectibles" value="128" className="widget-cut-corners" />
        <MetricCard title="Login Streak" value="4" className="widget-cut-corners" />
      </div>

      {/* A separator line to divide sections */}
      <Separator />

      {/* Main Content: Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (Main) Column */}
        <div className="lg:col-span-8 space-y-6">
          <LoreChartWidget />
          <CurrencySourceWidget />
        </div>

        {/* Right (Sidebar) Column */}
        <div className="lg:col-span-4 space-y-6">
          <SecuritySettingsWidget />
          <ThreatDetectionWidget />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
