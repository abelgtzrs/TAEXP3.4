import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Widget from "../ui/Widget";

const WorkoutTrackerWidget = () => {
  const [lastLog, setLastLog] = useState(null);

  useEffect(() => {
    api
      .get("/workouts?limit=1")
      .then((res) => {
        if (res.data.data.length > 0) {
          setLastLog(res.data.data[0]);
        }
      })
      .catch((err) => console.error("Failed to fetch last workout:", err));
  }, []);

  return (
    <Widget title="Workout Status">
      {lastLog ? (
        <div className="text-sm space-y-2">
          <p className="text-text-secondary">Last Logged Workout:</p>
          <h4 className="text-lg font-semibold text-primary">{lastLog.workoutName}</h4>
          <p className="text-text-secondary">on {new Date(lastLog.date).toLocaleDateString()}</p>
          <p className="text-white">{lastLog.exercises.length} exercises performed.</p>
        </div>
      ) : (
        <p className="text-sm text-text-tertiary">No workouts logged yet.</p>
      )}
      <Link to="/workouts/log">
        <button className="w-full mt-4 bg-primary hover:opacity-80 text-background font-bold py-3 rounded-lg transition duration-300">
          Log New Workout
        </button>
      </Link>
    </Widget>
  );
};

export default WorkoutTrackerWidget;
