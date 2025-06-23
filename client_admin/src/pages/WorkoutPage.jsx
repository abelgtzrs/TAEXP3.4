// src/pages/WorkoutPage.jsx
import { useState, useEffect } from "react";
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
    <div>
      <h1 className="text-3xl font-bold text-teal-400 mb-8">Workout Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
        <Link
          to="/workouts/log"
          className="p-10 bg-gray-800 rounded-lg hover:bg-gray-700 hover:border-teal-500 border-2 border-transparent transition-all duration-300"
        >
          <p className="text-5xl mb-4">🏋️</p>
          <h2 className="text-2xl font-bold text-white">
            Start a Clean Workout
          </h2>
          <p className="text-gray-400">Build your session from scratch.</p>
        </Link>
        <Link
          to="/workouts/new/template"
          className="p-10 bg-gray-800 rounded-lg hover:bg-gray-700 hover:border-teal-500 border-2 border-transparent transition-all duration-300"
        >
          <p className="text-5xl mb-4">📋</p>
          <h2 className="text-2xl font-bold text-white">
            Use a Prebuilt Workout
          </h2>
          <p className="text-gray-400">Select from your list of templates.</p>
        </Link>
      </div>

      {/* Section for past workout logs */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Recent Workouts
        </h2>
        {loading && <p className="text-gray-500">Loading history...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="space-y-4">
            {logs.length > 0 ? (
              logs.map((log) => <WorkoutLogItem key={log._id} log={log} />)
            ) : (
              <p className="text-gray-500">
                Your past workout logs will appear here.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPage;
