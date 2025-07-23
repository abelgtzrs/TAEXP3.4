import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import SpotifyWidget from "../components/dashboard/SpotifyWidget";
import TopProductsWidget from "../components/dashboard/TopProductsWidget";
import HabitTrackerWidget from "../components/dashboard/HabitTrackerWidget";
import BookTrackerWidget from "../components/dashboard/BookTrackerWidget";
import WorkoutTrackerWidget from "../components/dashboard/WorkoutTrackerWidget";
import ClockWidget from "../components/dashboard/ClockWidget";
import WeatherWidget from "../components/dashboard/WeatherWidget";
import PersonaWidget from "../components/dashboard/PersonaWidget";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-2"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <PageHeader title="Dashboard" subtitle={`Cognitive Framework Status for ${user.username || "Admin"}.`} />
      </motion.div>

      {/* --- Main Dashboard Grid --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-6 gap-4"
      >
        {/* Row 1: Full-width Stat Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="col-span-6"
        >
          <StatBoxRow stats={stats} loading={loading} />
        </motion.div>

        {/* --- Precise Widget Placement --- */}

        {/* A 4x4 Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="col-span-6 md:col-span-4 row-span-2"
        >
          <LoreChartWidget />
        </motion.div>

        {/* A 2x2 Clock */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="col-span-3 md:col-span-2 h-50"
        >
          <ClockWidget />
        </motion.div>

        {/* A 2x2 Weather Widget */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="col-span-3 md:col-span-2 h-50"
        >
          <WeatherWidget />
        </motion.div>

        {/* The Tracker Widgets, each taking up 2 columns */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="col-span-6 md:col-span-2 row-span-2"
        >
          <HabitTrackerWidget />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          className="col-span-6 md:col-span-2 row-span-2"
        >
          <BookTrackerWidget />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="col-span-6 md:col-span-2 row-span-2"
        >
          <WorkoutTrackerWidget />
        </motion.div>

        {/* The rest of the widgets filling the remaining space */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="col-span-6 md:col-span-3 lg:col-span-2 row-span-2"
        >
          <PersonaWidget />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="col-span-6 md:col-span-3 lg:col-span-2 row-span-2"
        >
          <SpotifyWidget />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="col-span-6 md:col-span-3 lg:col-span-2 row-span-2"
        >
          <SecuritySettingsWidget />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.7 }}
          className="col-span-6 lg:col-span-2 row-span-2"
        >
          <GoalsWidget />
        </motion.div>
        {/* Additional Widgets */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="col-span-6 md:col-span-3 lg:col-span-2 row-span-2"
        >
          <RecentAcquisitionsWidget />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.9 }}
          className="col-span-6 md:col-span-3 lg:col-span-2 row-span-2"
        >
          <TopProductsWidget />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 2.0 }}
          className="col-span-6 md:col-span-3 lg:col-span-2 row-span-2"
        >
          <CurrencySourceWidget />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
