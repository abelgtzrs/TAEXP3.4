import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

// UI Components
import PageHeader from "../components/ui/PageHeader";
import Widget from "../components/ui/Widget";

// Dashboard Widgets
import StatBoxRow from "../components/dashboard/StatBoxRow";
import LoreChartWidget from "../components/dashboard/LoreChartWidget";
import SecuritySettingsWidget from "../components/dashboard/SecuritySettingsWidget";
import ThreatDetectionWidget from "../components/dashboard/ThreatDetectionWidget";
import CurrencySourceWidget from "../components/dashboard/CurrencySourceWidget";
import GoalsWidget from "../components/dashboard/GoalsWidget";
import RecentAcquisitionsWidget from "../components/dashboard/RecentAcquisitionsWidget";
import SocialSalesWidget from "../components/dashboard/SocialSalesWidget";
import TopProductsWidget from "../components/dashboard/TopProductsWidget";
import HabitTrackerWidget from "../components/dashboard/HabitTrackerWidget";
import BookTrackerWidget from "../components/dashboard/BookTrackerWidget";
import WorkoutTrackerWidget from "../components/dashboard/WorkoutTrackerWidget";
import ClockWidget from "../components/dashboard/ClockWidget";
import WeatherWidget from "../components/dashboard/WeatherWidget";

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get("/users/me/dashboard-stats");
        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-2">
      <PageHeader title="Dashboard" subtitle={`Cognitive Framework Status for ${user.username || "Admin"}.`} />

      {/* --- Main Dashboard Grid --- */}
      <div className="grid grid-cols-6 gap-4 ">
        {/* Row 1: Full-width Stat Box */}
        <div className="col-span-6">
          <StatBoxRow stats={stats} loading={loading} />
        </div>

        {/* --- Precise Widget Placement --- */}

        {/* A 4x4 Chart */}
        <div className="col-span-6 md:col-span-4 row-span-2">
          <LoreChartWidget />
        </div>

        {/* A 2x2 Clock */}
        <div className="col-span-3 md:col-span-2 h-50">
          <ClockWidget />
        </div>

        {/* A 2x2 Weather Widget */}
        <div className="col-span-3 md:col-span-2 h-50">
          <WeatherWidget />
        </div>

        {/* The Tracker Widgets, each taking up 2 columns */}
        <div className="col-span-6 md:col-span-2 row-span-2">
          <HabitTrackerWidget />
        </div>
        <div className="col-span-6 md:col-span-2 row-span-2">
          <BookTrackerWidget />
        </div>
        <div className="col-span-6 md:col-span-2 row-span-2">
          <WorkoutTrackerWidget />
        </div>

        {/* The rest of the widgets filling the remaining space */}
        <div className="col-span-6 md:col-span-3 lg:col-span-2 row-span-2">
          <ThreatDetectionWidget />
        </div>
        <div className="col-span-6 md:col-span-3 lg:col-span-2 row-span-2">
          <SecuritySettingsWidget />
        </div>
        <div className="col-span-6 lg:col-span-2 row-span-2">
          <GoalsWidget />
        </div>
        {/* Additional Widgets */}
        <div className="col-span-6 md:col-span-3 lg:col-span-2 row-span-2">
          <RecentAcquisitionsWidget />
        </div>
        <div className="col-span-6 md:col-span-3 lg:col-span-2 row-span-2">
          <TopProductsWidget />
        </div>
        <div className="col-span-6 md:col-span-3 lg:col-span-2 row-span-2">
          <CurrencySourceWidget />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
