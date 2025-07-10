import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

// UI Components
import PageHeader from "../components/ui/PageHeader";
import Separator from "../components/ui/Separator";

// Dashboard Widgets
import StatBox from "../components/dashboard/StatBox";
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

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    habitsCompleted: 0,
    booksFinished: 0,
    gachaPulls: 0,
    activeStreaks: 0,
    totalWorkouts: 0,
    volumesPublished: 0,
  });
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
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle={`Cognitive Framework Status for ${user?.email || "Admin"}.`} />

      {/* --- Top Row: 6-Item Stat Box Container (Now Responsive) --- */}
      {/* On small screens, it's a 2-column grid. On medium, 3 columns. On large, all 6 are in a row. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-row bg-surface border border-gray-700/50 rounded-lg overflow-hidden">
        <StatBox
          title="Habits Completed Today"
          value={loading ? "..." : stats.habitsCompleted}
          change="+5.0%"
          changeType="increase"
          period="yesterday"
        />
        <StatBox
          title="Total Workouts"
          value={loading ? "..." : stats.totalWorkouts}
          change="+2"
          changeType="increase"
          period="last week"
        />
        <StatBox
          title="Books Finished"
          value={loading ? "..." : stats.booksFinished}
          change="-1"
          changeType="decrease"
          period="last month"
        />
        <StatBox
          title="Login Streak"
          value={loading ? "..." : stats.activeStreaks}
          change="+1"
          changeType="increase"
          period="today"
        />
        <StatBox
          title="Total Collectibles"
          value={loading ? "..." : stats.gachaPulls}
          change="+12"
          changeType="increase"
          period="this week"
        />
        <StatBox
          title="Volumes Published"
          value={loading ? "..." : stats.volumesPublished}
          change="+0"
          changeType="increase"
          period="this quarter"
        />
      </div>

      <Separator />

      {/* --- Main Content: Responsive Three-Column Layout --- */}
      {/* On mobile, all widgets are in a single column.
          On large screens (lg), it expands to a three-column layout. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (col-span-4 on large screens) */}
        <div className="lg:col-span-4 space-y-6">
          <HabitTrackerWidget />
          <BookTrackerWidget />
          <WorkoutTrackerWidget />
          <SocialSalesWidget />
        </div>

        {/* Center Column (col-span-5 on large screens) */}
        <div className="lg:col-span-5 space-y-6">
          <LoreChartWidget />
          <TopProductsWidget />
          <RecentAcquisitionsWidget />
        </div>

        {/* Right Column (col-span-3 on large screens) */}
        <div className="lg:col-span-3 space-y-6">
          <SecuritySettingsWidget />
          <ThreatDetectionWidget />
          <CurrencySourceWidget />
          <GoalsWidget />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
