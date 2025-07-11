import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Widget from "./Widget";
import StyledButton from "../ui/StyledButton";

const WORKOUT_TEMPLATES = [
  { name: "Push Day", to: "/workouts/log?template=push" },
  { name: "Pull Day", to: "/workouts/log?template=pull" },
  { name: "Leg Day", to: "/workouts/log?template=legs" },
  { name: "Full Body", to: "/workouts/log?template=fullbody" },
];

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
        <div className="text-sm space-y-2 mb-4">
          <p className="text-text-secondary">Last Logged Workout:</p>
          <h4 className="text-lg font-semibold text-primary">{lastLog.workoutName}</h4>
          <p className="text-text-secondary">on {new Date(lastLog.date).toLocaleDateString()}</p>
          <p className="text-white">{lastLog.exercises.length} exercises performed.</p>
        </div>
      ) : (
        <p className="text-sm text-text-tertiary mb-4">No workouts logged yet.</p>
      )}
      <div className="grid grid-cols-2 grid-rows-2 gap-2 mb-2">
        {WORKOUT_TEMPLATES.map((tpl) => (
          <Link key={tpl.name} to={tpl.to} className="block">
            <StyledButton className="w-full h-16 text-base font-semibold">{tpl.name}</StyledButton>
          </Link>
        ))}
      </div>
      <Link to="/workouts/log">
        <StyledButton className="w-full mt-2">Log Custom Workout</StyledButton>
      </Link>
    </Widget>
  );
};

export default WorkoutTrackerWidget;
