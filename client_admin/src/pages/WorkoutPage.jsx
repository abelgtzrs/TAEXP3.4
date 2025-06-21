// src/pages/WorkoutPage.jsx
import { Link } from "react-router-dom";
// We will also list recent workouts here later

const WorkoutPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-teal-400 mb-8">Workout Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
        {/* Option 1: Start a new, empty workout */}
        <Link
          to="/workouts/new/clean"
          className="p-10 bg-gray-800 rounded-lg hover:bg-gray-700 hover:border-teal-500 border-2 border-transparent transition-all duration-300"
        >
          <p className="text-5xl mb-4">🏋️</p>
          <h2 className="text-2xl font-bold text-white">
            Start a Clean Workout
          </h2>
          <p className="text-gray-400">Build your session from scratch.</p>
        </Link>

        {/* Option 2: Choose from a prebuilt template */}
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

      {/* A section for past workout logs will go here */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Recent Workouts
        </h2>
        {/* ... List of WorkoutLog items ... */}
        <p className="text-gray-500">
          Your past workout logs will appear here.
        </p>
      </div>
    </div>
  );
};

export default WorkoutPage;
