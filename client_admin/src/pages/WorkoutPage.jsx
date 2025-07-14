// src/pages/WorkoutPage.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../services/api";
import WorkoutLogItem from "../components/workouts/WorkoutLogItem";

const WorkoutPage = () => {
  // New state for storing workout history
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch workout logs when the page loads
  useEffect(() => {
    const fetchWorkoutLogs = async () => {
      try {
        const response = await api.get("/workouts");
        setLogs(response.data.data);
      } catch (err) {
        console.error("Failed to fetch workout logs:", err);
        setError("Could not load workout history.");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkoutLogs();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-bold text-teal-400 mb-8"
      >
        Workout Tracker
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <Link
            to="/workouts/log"
            className="block p-10 bg-gray-800 rounded-lg hover:bg-gray-700 hover:border-teal-500 border-2 border-transparent transition-all duration-300"
          >
            <p className="text-5xl mb-4">🏋️</p>
            <h2 className="text-2xl font-bold text-white">Start a Clean Workout</h2>
            <p className="text-gray-400">Build your session from scratch.</p>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <Link
            to="/workouts/new/template"
            className="block p-10 bg-gray-800 rounded-lg hover:bg-gray-700 hover:border-teal-500 border-2 border-transparent transition-all duration-300"
          >
            <p className="text-5xl mb-4">📋</p>
            <h2 className="text-2xl font-bold text-white">Use a Prebuilt Workout</h2>
            <p className="text-gray-400">Select from your list of templates.</p>
          </Link>
        </motion.div>
      </motion.div>

      {/* Section for past workout logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-12"
      >
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="text-2xl font-semibold text-white mb-4"
        >
          Recent Workouts
        </motion.h2>

        {loading && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500">
            Loading history...
          </motion.p>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-red-500"
          >
            {error}
          </motion.p>
        )}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="space-y-4"
          >
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <motion.div
                  key={log._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.3 + index * 0.1 }}
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                >
                  <WorkoutLogItem log={log} />
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                className="text-gray-500"
              >
                Your past workout logs will appear here.
              </motion.p>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WorkoutPage;
