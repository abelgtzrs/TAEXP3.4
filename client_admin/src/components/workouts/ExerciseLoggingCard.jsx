// src/components/workouts/ExerciseLoggingCard.jsx

const ExerciseLoggingCard = ({
  exercise,
  exerciseIndex,
  onSetChange,
  onAddSet,
  onRemoveExercise,
}) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-teal-400">{exercise.name}</h3>
        <button
          onClick={() => onRemoveExercise(exerciseIndex)}
          className="text-red-500 hover:text-red-400 text-xs"
        >
          Remove
        </button>
      </div>

      <div className="space-y-2">
        {exercise.sets.map((set, setIndex) => (
          <div key={setIndex} className="grid grid-cols-4 gap-2 items-center">
            <span className="text-gray-400 font-bold">Set {setIndex + 1}</span>
            <input
              type="number"
              placeholder="Weight (kg/lbs)"
              value={set.weight}
              onChange={(e) =>
                onSetChange(exerciseIndex, setIndex, "weight", e.target.value)
              }
              className="col-span-1 p-2 bg-gray-700 rounded border border-gray-600 text-white"
            />
            <input
              type="number"
              placeholder="Reps"
              value={set.reps}
              onChange={(e) =>
                onSetChange(exerciseIndex, setIndex, "reps", e.target.value)
              }
              className="col-span-1 p-2 bg-gray-700 rounded border border-gray-600 text-white"
            />
            {/* Placeholder for future delete set button */}
          </div>
        ))}
      </div>

      <button
        onClick={() => onAddSet(exerciseIndex)}
        className="mt-4 text-sm bg-gray-700 hover:bg-gray-600 text-teal-300 font-semibold py-2 px-4 rounded-md"
      >
        + Add Set
      </button>
    </div>
  );
};

export default ExerciseLoggingCard;
