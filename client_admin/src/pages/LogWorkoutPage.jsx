// src/pages/LogWorkoutPage.jsx

import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, Trash2, Save, CheckCircle2, Activity, ClipboardList } from "lucide-react";
import api from "../services/api";

// --- INLINE HELPER COMPONENTS ---
const StatBadge = ({ label, value }) => (
  <div className="flex flex-col p-2 bg-gray-800/70 rounded-md border border-gray-700 min-w-[90px]">
    <span className="text-[10px] tracking-wide text-gray-400 uppercase">{label}</span>
    <span className="text-lg font-semibold text-teal-300">{value}</span>
  </div>
);

const LogWorkoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { templateData } = location.state || {};

  const [workoutName, setWorkoutName] = useState(templateData?.name || "");
  const [loggedExercises, setLoggedExercises] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [overallFeeling, setOverallFeeling] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch exercises & template init
  useEffect(() => {
    api.get("/exercises").then((res) => setAllExercises(res.data.data));
    if (templateData) {
      const preloaded = templateData.exercises.map((ex) => ({
        exerciseDefinition: ex._id,
        name: ex.name,
        sets: [{ reps: "", weight: "" }],
      }));
      setLoggedExercises(preloaded);
    }
  }, [templateData]);

  // Filter exercises list by search
  const filteredExerciseOptions = useMemo(() => {
    if (!exerciseSearch.trim()) return allExercises;
    return allExercises.filter((ex) => ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()));
  }, [exerciseSearch, allExercises]);

  const addExercise = (exerciseId) => {
    const target = allExercises.find((ex) => ex._id === exerciseId);
    if (!target) return;
    if (loggedExercises.some((le) => le.exerciseDefinition === target._id)) return;
    setLoggedExercises((prev) => [
      ...prev,
      { exerciseDefinition: target._id, name: target.name, sets: [{ reps: "", weight: "" }] },
    ]);
  };

  const updateSetField = (exerciseIdx, setIdx, field, value) => {
    setLoggedExercises((prev) => {
      const copy = [...prev];
      copy[exerciseIdx] = {
        ...copy[exerciseIdx],
        sets: copy[exerciseIdx].sets.map((s, i) => (i === setIdx ? { ...s, [field]: value } : s)),
      };
      return copy;
    });
  };

  const addSet = (exerciseIdx) => {
    setLoggedExercises((prev) => {
      const copy = [...prev];
      copy[exerciseIdx] = { ...copy[exerciseIdx], sets: [...copy[exerciseIdx].sets, { reps: "", weight: "" }] };
      return copy;
    });
  };

  const removeExercise = (exerciseIdx) => {
    setLoggedExercises((prev) => prev.filter((_, i) => i !== exerciseIdx));
  };

  const removeSet = (exerciseIdx, setIdx) => {
    setLoggedExercises((prev) => {
      const copy = [...prev];
      const sets = copy[exerciseIdx].sets.filter((_, i) => i !== setIdx);
      copy[exerciseIdx] = { ...copy[exerciseIdx], sets: sets.length ? sets : [{ reps: "", weight: "" }] };
      return copy;
    });
  };

  // Derived stats
  const stats = useMemo(() => {
    let totalSets = 0;
    let totalReps = 0;
    let totalVolume = 0;
    loggedExercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        const reps = parseInt(s.reps) || 0;
        const weight = parseFloat(s.weight) || 0;
        if (reps > 0 && weight >= 0) {
          totalSets += 1;
          totalReps += reps;
          totalVolume += reps * weight;
        }
      });
    });
    return { exercises: loggedExercises.length, sets: totalSets, reps: totalReps, volume: totalVolume };
  }, [loggedExercises]);

  const buildPayload = () => {
    const exercises = loggedExercises
      .map((ex) => ({
        exerciseDefinition: ex.exerciseDefinition,
        sets: ex.sets.filter((s) => s.reps && s.weight),
      }))
      .filter((ex) => ex.sets.length > 0);
    return {
      date: new Date().toISOString(),
      workoutName: workoutName || "Workout Session",
      durationSessionMinutes: durationMinutes ? parseInt(durationMinutes) : undefined,
      exercises,
      overallFeeling: overallFeeling || undefined,
      notesSession: notes || undefined,
    };
  };

  const submitWorkout = async () => {
    setError("");
    setSuccess("");
    const payload = buildPayload();
    if (!payload.exercises.length) {
      setError("Log at least one complete set.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/workouts", payload);
      setSuccess(res.data.message || "Workout logged.");
      setTimeout(() => navigate("/workouts"), 900);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save workout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* LEFT: Meta & Exercise Library */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-3">
          <input
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="Workout name"
            className="w-full bg-gray-800 rounded px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="0"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              placeholder="Duration (min)"
              className="bg-gray-800 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <input
              type="text"
              value={overallFeeling}
              onChange={(e) => setOverallFeeling(e.target.value)}
              placeholder="Feeling (1-10 / words)"
              className="bg-gray-800 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Session notes..."
            className="w-full bg-gray-800 rounded px-3 py-2 text-xs h-24 resize-none focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col gap-2 min-h-[320px]">
          <h3 className="text-sm font-semibold text-teal-300 flex items-center gap-2">
            <ClipboardList size={16} /> Exercise Library
          </h3>
          <input
            type="text"
            value={exerciseSearch}
            onChange={(e) => setExerciseSearch(e.target.value)}
            placeholder="Search exercises..."
            className="bg-gray-800 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <div className="overflow-y-auto custom-scroll min-h-[200px] flex flex-col gap-1 pr-1">
            {filteredExerciseOptions.map((ex) => {
              const already = loggedExercises.some((l) => l.exerciseDefinition === ex._id);
              return (
                <button
                  key={ex._id}
                  onClick={() => addExercise(ex._id)}
                  disabled={already}
                  className={`text-left text-xs px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 transition border border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {ex.name}
                </button>
              );
            })}
            {filteredExerciseOptions.length === 0 && (
              <div className="text-[11px] text-gray-500 italic py-4">No matches.</div>
            )}
          </div>
        </div>
      </div>

      {/* CENTER: Exercise Editor */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
        {loggedExercises.length === 0 && (
          <div className="p-6 border border-dashed border-gray-600 rounded-lg text-center text-sm text-gray-400">
            Select exercises from the library to begin logging.
          </div>
        )}
        {loggedExercises.map((ex, eIdx) => (
          <div key={eIdx} className="bg-gray-900 rounded-lg border border-gray-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm text-teal-300">{ex.name}</h4>
              <button
                onClick={() => removeExercise(eIdx)}
                className="text-gray-500 hover:text-red-500 p-1"
                title="Remove exercise"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="py-1 text-left w-10">#</th>
                    <th className="py-1 text-left w-20">Reps</th>
                    <th className="py-1 text-left w-24">Weight</th>
                    <th className="py-1 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {ex.sets.map((s, sIdx) => {
                    const invalidReps = s.reps && isNaN(parseInt(s.reps));
                    const invalidWeight = s.weight && isNaN(parseFloat(s.weight));
                    return (
                      <tr key={sIdx} className="border-b border-gray-800 last:border-0">
                        <td className="py-1 pr-2 text-gray-500 font-mono">{sIdx + 1}</td>
                        <td className="py-1 pr-2">
                          <input
                            value={s.reps}
                            onChange={(e) => updateSetField(eIdx, sIdx, "reps", e.target.value)}
                            placeholder="10"
                            className={`w-full bg-gray-800 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                              invalidReps ? "ring-1 ring-red-500" : ""
                            }`}
                          />
                        </td>
                        <td className="py-1 pr-2">
                          <input
                            value={s.weight}
                            onChange={(e) => updateSetField(eIdx, sIdx, "weight", e.target.value)}
                            placeholder="45"
                            className={`w-full bg-gray-800 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                              invalidWeight ? "ring-1 ring-red-500" : ""
                            }`}
                          />
                        </td>
                        <td className="py-1 text-right">
                          <button
                            onClick={() => removeSet(eIdx, sIdx)}
                            className="text-gray-500 hover:text-red-500 p-1"
                            title="Remove set"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => addSet(eIdx)}
                className="text-xs flex items-center gap-1 text-teal-300 hover:text-teal-200"
              >
                <Plus size={14} /> Add Set
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: Live Summary */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-3">
          <h3 className="text-sm font-semibold text-teal-300 flex items-center gap-2">
            <Activity size={16} /> Session Summary
          </h3>
          <div className="flex flex-wrap gap-2">
            <StatBadge label="Exercises" value={stats.exercises} />
            <StatBadge label="Sets" value={stats.sets} />
            <StatBadge label="Reps" value={stats.reps} />
            <StatBadge label="Volume" value={stats.volume} />
          </div>
          <div className="text-[11px] text-gray-500 leading-relaxed border-t border-gray-800 pt-2">
            Volume = sum(reps * weight). Add accurate numbers for better tracking.
          </div>
        </div>
        {error && (
          <div className="text-xs text-red-400 bg-red-900/20 border border-red-700/40 p-2 rounded">{error}</div>
        )}
        {success && (
          <div className="text-xs text-green-400 bg-green-900/10 border border-green-700/40 p-2 rounded">{success}</div>
        )}
      </div>

      {/* ACTION BAR */}
      <div className="col-span-12 sticky bottom-0 pt-2">
        <div className="bg-gray-950/90 backdrop-blur border border-gray-800 rounded-lg p-4 flex flex-col md:flex-row items-center gap-3 justify-between">
          <div className="text-[11px] text-gray-400">
            {stats.sets === 0
              ? "No sets logged yet."
              : `${stats.sets} sets • ${stats.reps} reps • Volume ${stats.volume}`}
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={submitWorkout}
              disabled={loading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-600 text-white text-sm font-semibold px-6 py-2 rounded"
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <CheckCircle2 size={16} /> Finish & Log
                </>
              )}
            </button>
            <button
              onClick={() => navigate("/workouts")}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-5 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogWorkoutPage;
