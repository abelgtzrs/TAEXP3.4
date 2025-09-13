// src/pages/AdminExercisesPage.jsx
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import { Search, Dumbbell, Activity, LayoutList, Trash2, PlusCircle, XCircle, Save, RefreshCcw } from "lucide-react";

// --- Configuration Data ---
// It's good practice to define static option lists as constants.
const MUSCLE_GROUP_OPTIONS = [
  "Chest",
  "Triceps",
  "Biceps",
  "Back",
  "Back (Lower)",
  "Shoulders",
  "Quads",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Legs",
  "Abs",
  "Core",
  "Forearms",
  "Full Body",
];

const EQUIPMENT_OPTIONS = [
  "Machine",
  "Cables",
  "Dumbbell",
  "Barbell",
  "EZ Bar",
  "Kettlebell",
  "Bodyweight",
  "Treadmill",
  "Bike",
  "Resistance Band",
];

const EXERCISE_TYPE_OPTIONS = ["Strength", "Cardio", "Flexibility"];

// This is the starting state for a new, blank form.
const STRENGTH_PRESET = [
  { name: "weight", unit: "lbs" },
  { name: "reps", unit: "count" },
];
const CARDIO_PRESET = [
  { name: "distance", unit: "miles" },
  { name: "duration", unit: "min" },
];
const FLEX_PRESET = [{ name: "duration", unit: "min" }];

const INITIAL_FORM_STATE = {
  name: "",
  description: "",
  exerciseType: "Strength",
  muscleGroups: [],
  equipment: [],
  defaultMetrics: [...STRENGTH_PRESET],
};

const AdminExercisesPage = () => {
  // --- State Management ---
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [touchedMetrics, setTouchedMetrics] = useState(false); // track if user manually changed metrics

  // --- Data Fetching ---
  const fetchExercises = async () => {
    try {
      setLoading(true);
      const res = await api.get("/exercises");
      setExercises(res.data.data);
    } catch (error) {
      setError("Failed to fetch exercises.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch exercises when the component first loads.
  useEffect(() => {
    fetchExercises();
  }, []);

  // --- Form Handlers ---

  // Handles changes for simple text inputs and select dropdowns.
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "exerciseType") {
      let preset;
      if (value === "Strength") preset = STRENGTH_PRESET;
      else if (value === "Cardio") preset = CARDIO_PRESET;
      else preset = FLEX_PRESET;
      setFormData((prev) => ({
        ...prev,
        exerciseType: value,
        defaultMetrics: touchedMetrics ? prev.defaultMetrics : [...preset],
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handles changes for the multi-select checkboxes.
  const handleCheckboxChange = (field, value) => {
    const currentValues = formData[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value) // Uncheck: remove from array
      : [...currentValues, value]; // Check: add to array
    setFormData({ ...formData, [field]: newValues });
  };

  // Handles changes for the dynamic metrics inputs.
  const handleMetricChange = (index, field, value) => {
    const newMetrics = [...formData.defaultMetrics];
    newMetrics[index][field] = value;
    setTouchedMetrics(true);
    setFormData({ ...formData, defaultMetrics: newMetrics });
  };

  // Adds a new blank metric row to the form.
  const addMetric = () => {
    setTouchedMetrics(true);
    setFormData({ ...formData, defaultMetrics: [...formData.defaultMetrics, { name: "", unit: "" }] });
  };

  // Removes a metric row from the form.
  const removeMetric = (index) => {
    setTouchedMetrics(true);
    const newMetrics = formData.defaultMetrics.filter((_, i) => i !== index);
    setFormData({ ...formData, defaultMetrics: newMetrics });
  };

  // --- Main Actions ---

  // Populates the form when an "Edit" button is clicked.
  const handleEditClick = (exercise) => {
    setEditingId(exercise._id);
    setTouchedMetrics(false);
    setFormData({
      name: exercise.name,
      description: exercise.description,
      exerciseType: exercise.exerciseType,
      muscleGroups: exercise.muscleGroups || [],
      equipment: exercise.equipment || [],
      defaultMetrics: exercise.defaultMetrics?.length ? exercise.defaultMetrics : [...STRENGTH_PRESET],
    });
  };

  // Clears the form and resets it to "Create" mode.
  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setEditingId(null);
    setTouchedMetrics(false);
  };

  // Handles form submission for both creating and updating.
  const validateMetrics = () => {
    if (!formData.defaultMetrics.length) return false;
    const seen = new Set();
    for (const m of formData.defaultMetrics) {
      if (!m.name.trim() || !m.unit.trim()) return false;
      const key = m.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateMetrics()) {
      setError("Fix metric rows: require unique names and units.");
      return;
    }
    try {
      if (editingId) {
        await api.put(`/admin/exercises/${editingId}`, formData);
      } else {
        await api.post("/admin/exercises", formData);
      }
      resetForm();
      await fetchExercises();
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred.");
    }
  };

  // Handles the delete action.
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This will delete the exercise definition permanently.")) {
      try {
        await api.delete(`/admin/exercises/${id}`);
        await fetchExercises();
      } catch (error) {
        setError("Failed to delete exercise.");
      }
    }
  };

  // Filtered list
  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      const m = ex.name.toLowerCase().includes(search.toLowerCase());
      const t = typeFilter === "All" || ex.exerciseType === typeFilter;
      return m && t;
    });
  }, [exercises, search, typeFilter]);

  const applyPreset = (preset) => {
    setTouchedMetrics(true);
    setFormData((prev) => ({ ...prev, defaultMetrics: preset }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold text-teal-400 mb-6">Manage Exercise Definitions</h1>
      <div className="grid grid-cols-12 gap-2">
        {/* LEFT: List & Filters */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Search size={16} className="text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exercises..."
                className="flex-grow bg-gray-800 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-gray-800 rounded px-2 py-1 text-xs focus:outline-none"
              >
                <option>All</option>
                {EXERCISE_TYPE_OPTIONS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="text-[11px] text-gray-500">{filtered.length} matching</div>
            <div className="overflow-y-auto max-h-[60vh] pr-1 space-y-1">
              {filtered.map((ex) => (
                <button
                  key={ex._id}
                  onClick={() => handleEditClick(ex)}
                  className={`w-full text-left px-3 py-2 rounded border text-sm transition flex items-center justify-between ${
                    editingId === ex._id
                      ? "bg-teal-600/30 border-teal-600 text-teal-200"
                      : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                  }`}
                >
                  <span className="truncate">{ex.name}</span>
                  <span className="text-[10px] uppercase text-gray-400 ml-2">{ex.exerciseType}</span>
                </button>
              ))}
              {!filtered.length && <div className="text-xs text-gray-500 py-4 text-center">No exercises found.</div>}
            </div>
            <button
              onClick={resetForm}
              className="mt-2 text-xs text-teal-300 hover:text-teal-200 flex items-center gap-1"
            >
              <RefreshCcw size={14} /> New Definition
            </button>
          </div>
        </div>

        {/* CENTER: Editor */}
        <div className="col-span-12 lg:col-span-5">
          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg border border-gray-700 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{editingId ? "Edit Exercise" : "Create Exercise"}</h2>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1"
                >
                  <XCircle size={14} /> Cancel
                </button>
              )}
            </div>
            <input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Name (e.g. Bench Press, Running)"
              required
              className="w-full bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Description / cues / notes"
              className="w-full bg-gray-800 rounded px-3 py-2 text-xs h-24 resize-none focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                name="exerciseType"
                value={formData.exerciseType}
                onChange={handleFormChange}
                className="bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {EXERCISE_TYPE_OPTIONS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => applyPreset(STRENGTH_PRESET)}
                  className="flex-1 text-[10px] px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-teal-300 border border-gray-700 flex items-center gap-1"
                >
                  <Dumbbell size={12} /> Strength Preset
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(CARDIO_PRESET)}
                  className="flex-1 text-[10px] px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-teal-300 border border-gray-700 flex items-center gap-1"
                >
                  <Activity size={12} /> Cardio Preset
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(FLEX_PRESET)}
                  className="flex-1 text-[10px] px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-teal-300 border border-gray-700 flex items-center gap-1"
                >
                  <LayoutList size={12} /> Flex Preset
                </button>
              </div>
            </div>
            {/* Muscle Groups */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 mb-1">Muscle Groups</h3>
              <div className="flex flex-wrap gap-1">
                {MUSCLE_GROUP_OPTIONS.map((g) => {
                  const active = formData.muscleGroups.includes(g);
                  return (
                    <button
                      type="button"
                      key={g}
                      onClick={() => handleCheckboxChange("muscleGroups", g)}
                      className={`px-2 py-1 rounded text-[10px] border ${
                        active
                          ? "bg-teal-600/30 border-teal-500 text-teal-200"
                          : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Equipment */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 mb-1">Equipment</h3>
              <div className="flex flex-wrap gap-1">
                {EQUIPMENT_OPTIONS.map((eq) => {
                  const active = formData.equipment.includes(eq);
                  return (
                    <button
                      type="button"
                      key={eq}
                      onClick={() => handleCheckboxChange("equipment", eq)}
                      className={`px-2 py-1 rounded text-[10px] border ${
                        active
                          ? "bg-teal-600/30 border-teal-500 text-teal-200"
                          : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {eq}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Metrics */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 mb-2">Default Metrics</h3>
              <div className="space-y-2">
                {formData.defaultMetrics.map((m, i) => {
                  const dupName =
                    formData.defaultMetrics.filter((mm) => mm.name.toLowerCase() === m.name.toLowerCase()).length > 1;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={m.name}
                        onChange={(e) => handleMetricChange(i, "name", e.target.value)}
                        placeholder="metric (e.g. weight)"
                        className={`flex-1 bg-gray-800 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                          dupName ? "ring-1 ring-red-500" : ""
                        }`}
                      />
                      <input
                        value={m.unit}
                        onChange={(e) => handleMetricChange(i, "unit", e.target.value)}
                        placeholder="unit (e.g. lbs)"
                        className="w-24 bg-gray-800 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeMetric(i)}
                        className="p-1 text-gray-500 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={addMetric}
                className="mt-2 text-xs text-teal-300 hover:text-teal-200 flex items-center gap-1"
              >
                <PlusCircle size={14} /> Add Metric
              </button>
            </div>
            {error && (
              <div className="text-xs text-red-400 bg-red-900/20 border border-red-700/40 p-2 rounded">{error}</div>
            )}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold px-4 py-2 rounded"
              >
                <Save size={16} /> {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded"
                >
                  <XCircle size={16} /> Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT: Preview & Guidance */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-teal-300">Definition Preview</h3>
            <div className="text-xs text-gray-400 space-y-1">
              <div>
                <span className="text-gray-500">Name:</span>{" "}
                {formData.name || <span className="italic">(untitled)</span>}
              </div>
              <div>
                <span className="text-gray-500">Type:</span> {formData.exerciseType}
              </div>
              <div>
                <span className="text-gray-500">Muscles:</span>{" "}
                {formData.muscleGroups.length ? formData.muscleGroups.join(", ") : "—"}
              </div>
              <div>
                <span className="text-gray-500">Equipment:</span>{" "}
                {formData.equipment.length ? formData.equipment.join(", ") : "—"}
              </div>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Metrics</h4>
              <ul className="text-xs list-disc list-inside space-y-0.5 text-gray-300">
                {formData.defaultMetrics.map((m, i) => (
                  <li key={i}>
                    {m.name || <span className="italic text-gray-500">(name)</span>}{" "}
                    <span className="text-gray-500">[{m.unit || "?"}]</span>
                  </li>
                ))}
                {!formData.defaultMetrics.length && <li className="italic text-gray-500">None</li>}
              </ul>
            </div>
            <div className="text-[10px] text-gray-500 border-t border-gray-800 pt-2 leading-relaxed">
              Cardio preset uses miles & minutes. Strength uses lbs & reps. You can customize metrics anytime—duplicates
              are flagged.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminExercisesPage;
