// src/pages/LogWorkoutPage.jsx

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
// We need to create this component, which you have already done.
// Make sure it exists at 'src/components/workouts/ExerciseLoggingCard.jsx'
import ExerciseLoggingCard from "../components/workouts/ExerciseLoggingCard";

const LogWorkoutPage = () => {
  // These hooks from react-router-dom help with navigation and getting data passed from a previous page.
  const location = useLocation();
  const navigate = useNavigate();

  // This checks if we navigated here from the template selection page.
  // 'location.state?.templateData' safely accesses the template data if it exists.
  const { templateData } = location.state || {};

  // --- STATE MANAGEMENT ---
  // State for the workout's name (e.g., "Push Day")
  const [workoutName, setWorkoutName] = useState("");
  // State for the list of exercises the user is currently logging.
  const [loggedExercises, setLoggedExercises] = useState([]);
  // State to hold the master list of all possible exercises for the dropdown.
  const [allExercises, setAllExercises] = useState([]);
  // State for the "Add Exercise" dropdown selector.
  const [selectedExercise, setSelectedExercise] = useState("");
  // State to handle loading feedback on the submit button.
  const [loading, setLoading] = useState(false);

  // This `useEffect` hook runs once when the page loads.
  useEffect(() => {
    // Fetch all possible exercises to populate our "Add Exercise" dropdown.
    api.get("/exercises").then((res) => setAllExercises(res.data.data));

    // If we received template data from the previous page, pre-populate the workout.
    if (templateData) {
      setWorkoutName(templateData.name);
      const exercisesFromTemplate = templateData.exercises.map((ex) => ({
        exerciseDefinition: ex._id,
        name: ex.name, // We need the name for display purposes.
        sets: [{ reps: "", weight: "" }], // Start each exercise with one empty set.
      }));
      setLoggedExercises(exercisesFromTemplate);
    }
  }, [templateData]); // This effect re-runs if the template data changes.

  // --- HANDLER FUNCTIONS ---

  // Adds a new exercise card to the current workout log.
  const handleAddExercise = () => {
    if (!selectedExercise) return;
    const exerciseToAdd = allExercises.find(
      (ex) => ex._id === selectedExercise
    );
    // Ensure we don't add the same exercise twice.
    if (
      exerciseToAdd &&
      !loggedExercises.some((le) => le.exerciseDefinition === selectedExercise)
    ) {
      setLoggedExercises([
        ...loggedExercises,
        {
          exerciseDefinition: exerciseToAdd._id,
          name: exerciseToAdd.name,
          sets: [{ reps: "", weight: "" }],
        },
      ]);
    }
    setSelectedExercise(""); // Reset the dropdown after adding.
  };

  // Updates a specific field (reps or weight) in a specific set of a specific exercise.
  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const newLoggedExercises = [...loggedExercises];
    newLoggedExercises[exerciseIndex].sets[setIndex][field] = value;
    setLoggedExercises(newLoggedExercises);
  };

  // Adds a new empty set to a specific exercise.
  const handleAddSet = (exerciseIndex) => {
    const newLoggedExercises = [...loggedExercises];
    newLoggedExercises[exerciseIndex].sets.push({ reps: "", weight: "" });
    setLoggedExercises(newLoggedExercises);
  };

  // Removes an entire exercise card from the workout log.
  const handleRemoveExercise = (exerciseIndex) => {
    setLoggedExercises(
      loggedExercises.filter((_, index) => index !== exerciseIndex)
    );
  };

  // Submits the entire workout log to the backend.
  const handleLogWorkout = async () => {
    setLoading(true);
    // Prepare the final data payload for the API.
    const finalLog = {
      workoutName: workoutName || templateData?.name || "Workout Session",
      exercises: loggedExercises
        .map((ex) => ({
          exerciseDefinition: ex.exerciseDefinition,
          // Filter out any empty sets the user may have added but not filled out.
          sets: ex.sets.filter((set) => set.reps && set.weight),
        }))
        // Filter out any exercises where no sets were completed.
        .filter((ex) => ex.sets.length > 0),
    };

    if (finalLog.exercises.length === 0) {
      alert("Please log at least one completed set for an exercise.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/workouts", finalLog);
      alert(response.data.message || "Workout Logged Successfully!");
      navigate("/workouts"); // Go back to the main workout hub page on success.
    } catch (err) {
      alert("Failed to log workout.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
        placeholder="Name your workout (e.g., Push Day)"
        className="w-full p-4 bg-gray-800 text-white text-2xl font-bold rounded-lg mb-6 focus:outline-none focus:border-teal-500 border-2 border-transparent"
      />

      <div className="space-y-6">
        {loggedExercises.map((exercise, index) => (
          <ExerciseLoggingCard
            key={index}
            exercise={exercise}
            exerciseIndex={index}
            onSetChange={handleSetChange}
            onAddSet={handleAddSet}
            onRemoveExercise={handleRemoveExercise}
          />
        ))}
      </div>

      {/* UI to add more exercises to the current log */}
      <div className="my-6 p-4 bg-gray-800/50 rounded-lg flex items-center gap-4">
        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className="flex-grow p-3 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-teal-500"
        >
          <option value="">-- Add another exercise --</option>
          {allExercises.map((ex) => (
            <option key={ex._id} value={ex._id}>
              {ex.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddExercise}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg"
        >
          Add Exercise
        </button>
      </div>

      <button
        onClick={handleLogWorkout}
        disabled={loading}
        className="w-full mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-lg text-xl disabled:bg-gray-500"
      >
        {loading ? "Logging Workout..." : "Finish & Log Workout"}
      </button>
    </div>
  );
};

export default LogWorkoutPage;
