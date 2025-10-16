// src/pages/AdminExercisesPage.jsx
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import { Search, Dumbbell, Activity, LayoutList, Trash2, PlusCircle, XCircle, Save, RefreshCcw } from "lucide-react";

// --- Configuration Data ---
export const MUSCLE_GROUP_OPTIONS = [
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

export const EQUIPMENT_OPTIONS = [
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

export const EXERCISE_TYPE_OPTIONS = ["Strength", "Cardio", "Flexibility"];

export const STRENGTH_PRESET = [
  { name: "weight", unit: "lbs" },
  { name: "reps", unit: "count" },
];
export const CARDIO_PRESET = [
  { name: "distance", unit: "miles" },
  { name: "duration", unit: "min" },
];
export const FLEX_PRESET = [{ name: "duration", unit: "min" }];

const INITIAL_FORM_STATE = {
  name: "",
  description: "",
  exerciseType: "Strength",
  muscleGroups: [],
  equipment: [],
  defaultMetrics: [...STRENGTH_PRESET],
};

const AdminExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [touchedMetrics, setTouchedMetrics] = useState(false);

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

  useEffect(() => {
    fetchExercises();
  }, []);

  // --- Form Handlers ---
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

  const handleCheckboxChange = (field, value) => {
    const currentValues = formData[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
    setFormData({ ...formData, [field]: newValues });
  };

  const handleMetricChange = (index, field, value) => {
    const newMetrics = [...formData.defaultMetrics];
    newMetrics[index][field] = value;
    setTouchedMetrics(true);
    setFormData({ ...formData, defaultMetrics: newMetrics });
  };

  const addMetric = () => {
    setTouchedMetrics(true);
    setFormData({ ...formData, defaultMetrics: [...formData.defaultMetrics, { name: "", unit: "" }] });
  };

  const removeMetric = (index) => {
    setTouchedMetrics(true);
    const newMetrics = formData.defaultMetrics.filter((_, i) => i !== index);
    setFormData({ ...formData, defaultMetrics: newMetrics });
  };

  // --- Main Actions ---
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

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setEditingId(null);
    setTouchedMetrics(false);
  };

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
      <h1 className="text-3xl font-bold text-primary mb-6">Manage Exercise Definitions</h1>
      <div className="grid grid-cols-12 gap-2">
        {/* LEFT: List & Filters */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <div
            className="rounded-lg border p-4 flex flex-col gap-3"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-primary)" }}
          >
            <div className="flex items-center gap-2">
              <Search size={16} className="text-text-secondary" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exercises..."
                className="flex-grow rounded px-2 py-1 text-sm border focus:outline-none"
                style={{
                  background: "var(--color-background)",
                  borderColor: "var(--color-primary)",
                  color: "var(--color-text-main)",
                }}
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded px-2 py-1 text-xs border focus:outline-none"
                style={{
                  background: "var(--color-background)",
                  borderColor: "var(--color-primary)",
                  color: "var(--color-text-main)",
                }}
              >
                <option>All</option>
                {EXERCISE_TYPE_OPTIONS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="text-[11px] text-text-secondary">{filtered.length} matching</div>
            <div className="overflow-y-auto max-h-[60vh] pr-1 space-y-1">
              {filtered.map((ex) => {
                const active = editingId === ex._id;
                return (
                  <button
                    key={ex._id}
                    onClick={() => handleEditClick(ex)}
                    className="w-full text-left px-3 py-2 rounded border text-sm transition flex items-center justify-between"
                    style={{
                      background: active ? "var(--color-surface)" : "var(--color-background)",
                      borderColor: "var(--color-primary)",
                      color: active ? "var(--color-primary)" : "var(--color-text-main)",
                    }}
                  >
                    <span className="truncate">{ex.name}</span>
                    <span className="text-[10px] uppercase ml-2" style={{ color: "var(--color-text-secondary)" }}>
                      {ex.exerciseType}
                    </span>
                  </button>
                );
              })}
              {!filtered.length && (
                <div className="text-xs text-text-secondary py-4 text-center">No exercises found.</div>
              )}
            </div>
            <button onClick={resetForm} className="mt-2 text-xs text-primary hover:opacity-90 flex items-center gap-1">
              <RefreshCcw size={14} /> New Definition
            </button>
          </div>
        </div>

        {/* CENTER: Editor */}
        <div className="col-span-12 lg:col-span-5">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border p-5 space-y-5"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-primary)" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-main">
                {editingId ? "Edit Exercise" : "Create Exercise"}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-text-secondary hover:opacity-90 flex items-center gap-1"
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
              className="w-full rounded px-3 py-2 text-sm border focus:outline-none"
              style={{
                background: "var(--color-background)",
                borderColor: "var(--color-primary)",
                color: "var(--color-text-main)",
              }}
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Description / cues / notes"
              className="w-full rounded px-3 py-2 text-xs h-24 resize-none border focus:outline-none"
              style={{
                background: "var(--color-background)",
                borderColor: "var(--color-primary)",
                color: "var(--color-text-main)",
              }}
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                name="exerciseType"
                value={formData.exerciseType}
                onChange={handleFormChange}
                className="rounded px-3 py-2 text-sm border focus:outline-none"
                style={{
                  background: "var(--color-background)",
                  borderColor: "var(--color-primary)",
                  color: "var(--color-text-main)",
                }}
              >
                {EXERCISE_TYPE_OPTIONS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => applyPreset(STRENGTH_PRESET)}
                  className="flex-1 text-[10px] px-2 py-1 rounded border flex items-center gap-1 hover:opacity-90"
                  style={{
                    background: "var(--color-background)",
                    borderColor: "var(--color-primary)",
                    color: "var(--color-primary)",
                  }}
                >
                  <Dumbbell size={12} /> Strength Preset
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(CARDIO_PRESET)}
                  className="flex-1 text-[10px] px-2 py-1 rounded border flex items-center gap-1 hover:opacity-90"
                  style={{
                    background: "var(--color-background)",
                    borderColor: "var(--color-primary)",
                    color: "var(--color-primary)",
                  }}
                >
                  <Activity size={12} /> Cardio Preset
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(FLEX_PRESET)}
                  className="flex-1 text-[10px] px-2 py-1 rounded border flex items-center gap-1 hover:opacity-90"
                  style={{
                    background: "var(--color-background)",
                    borderColor: "var(--color-primary)",
                    color: "var(--color-primary)",
                  }}
                >
                  <LayoutList size={12} /> Flex Preset
                </button>
              </div>
            </div>
            {/* Muscle Groups */}
            <div>
              <h3 className="text-xs font-semibold text-text-secondary mb-1">Muscle Groups</h3>
              <div className="flex flex-wrap gap-1">
                {MUSCLE_GROUP_OPTIONS.map((g) => {
                  const active = formData.muscleGroups.includes(g);
                  return (
                    <button
                      type="button"
                      key={g}
                      onClick={() => handleCheckboxChange("muscleGroups", g)}
                      className={`px-2 py-1 rounded text-[10px] border`}
                      style={{
                        background: "var(--color-background)",
                        borderColor: "var(--color-primary)",
                        color: active ? "var(--color-primary)" : "var(--color-text-secondary)",
                      }}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Equipment */}
            <div>
              <h3 className="text-xs font-semibold text-text-secondary mb-1">Equipment</h3>
              <div className="flex flex-wrap gap-1">
                {EQUIPMENT_OPTIONS.map((eq) => {
                  const active = formData.equipment.includes(eq);
                  return (
                    <button
                      type="button"
                      key={eq}
                      onClick={() => handleCheckboxChange("equipment", eq)}
                      className={`px-2 py-1 rounded text-[10px] border`}
                      style={{
                        background: "var(--color-background)",
                        borderColor: "var(--color-primary)",
                        color: active ? "var(--color-primary)" : "var(--color-text-secondary)",
                      }}
                    >
                      {eq}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Metrics */}
            <div>
              <h3 className="text-xs font-semibold text-text-secondary mb-2">Default Metrics</h3>
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
                        className={`flex-1 rounded px-2 py-1 text-xs border focus:outline-none ${
                          dupName ? "ring-1 ring-red-500" : ""
                        }`}
                        style={{
                          background: "var(--color-background)",
                          borderColor: "var(--color-primary)",
                          color: "var(--color-text-main)",
                        }}
                      />
                      <input
                        value={m.unit}
                        onChange={(e) => handleMetricChange(i, "unit", e.target.value)}
                        placeholder="unit (e.g. lbs)"
                        className="w-24 rounded px-2 py-1 text-xs border focus:outline-none"
                        style={{
                          background: "var(--color-background)",
                          borderColor: "var(--color-primary)",
                          color: "var(--color-text-main)",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeMetric(i)}
                        className="p-1 text-text-secondary hover:text-red-500"
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
                className="mt-2 text-xs text-primary hover:opacity-90 flex items-center gap-1"
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
                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-white text-sm font-semibold px-4 py-2 rounded"
              >
                <Save size={16} /> {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 border hover:opacity-90 text-text-main text-sm font-medium px-4 py-2 rounded bg-background"
                  style={{ borderColor: "var(--color-primary)" }}
                >
                  <XCircle size={16} /> Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT: Preview & Guidance */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <div
            className="rounded-lg border p-4 space-y-3"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-primary)" }}
          >
            <h3 className="text-sm font-semibold text-primary">Definition Preview</h3>
            <div className="text-xs text-text-secondary space-y-1">
              <div>
                <span className="text-text-secondary">Name:</span>{" "}
                {formData.name || <span className="italic text-text-secondary">(untitled)</span>}
              </div>
              <div>
                <span className="text-text-secondary">Type:</span> {formData.exerciseType}
              </div>
              <div>
                <span className="text-text-secondary">Muscles:</span>{" "}
                <span className="text-text-main">
                  {formData.muscleGroups.length ? formData.muscleGroups.join(", ") : "—"}
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Equipment:</span>{" "}
                <span className="text-text-main">
                  {formData.equipment.length ? formData.equipment.join(", ") : "—"}
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-wide text-text-secondary mb-1">Metrics</h4>
              <ul className="text-xs list-disc list-inside space-y-0.5 text-text-main">
                {formData.defaultMetrics.map((m, i) => (
                  <li key={i}>
                    {m.name || <span className="italic text-text-secondary">(name)</span>}{" "}
                    <span className="text-text-secondary">[{m.unit || "?"}]</span>
                  </li>
                ))}
                {!formData.defaultMetrics.length && <li className="italic text-text-secondary">None</li>}
              </ul>
            </div>
            <div
              className="text-[10px] text-text-secondary border-t pt-2 leading-relaxed"
              style={{ borderColor: "var(--color-primary)" }}
            >
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
