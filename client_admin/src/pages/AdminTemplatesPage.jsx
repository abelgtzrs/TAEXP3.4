// src/pages/AdminTemplatesPage.jsx
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import {
  FiSearch,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiCopy,
  FiX,
  FiSave,
  FiAlertTriangle,
  FiArrowUp,
  FiArrowDown,
  FiMinusCircle,
  FiList,
} from "react-icons/fi";

const AdminTemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [search, setSearch] = useState("");
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [activeId, setActiveId] = useState(null); // selected template for editing
  const [form, setForm] = useState({ name: "", description: "", exercises: [] });
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // UI density for exercise selector (compact default per user preference)
  const [density, setDensity] = useState("ultra");
  const [showLibrary, setShowLibrary] = useState(true); // for small screens toggle
  const cycleDensity = () => {
    setDensity((d) => (d === "ultra" ? "compact" : d === "compact" ? "comfort" : "ultra"));
  };
  const moveExercise = (idx, dir) => {
    setForm((f) => {
      const arr = [...f.exercises];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= arr.length) return f;
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return { ...f, exercises: arr };
    });
    setDirty(true);
  };
  const removeExerciseAt = (idx) => {
    setForm((f) => ({ ...f, exercises: f.exercises.filter((_, i) => i !== idx) }));
    setDirty(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [templatesRes, exercisesRes] = await Promise.all([api.get("/workout-templates"), api.get("/exercises")]);
      setTemplates(templatesRes.data.data);
      setAllExercises(exercisesRes.data.data);
    } catch (e) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseToggle = (exerciseId) => {
    setForm((f) => {
      const exists = f.exercises.includes(exerciseId);
      const exercises = exists ? f.exercises.filter((id) => id !== exerciseId) : [...f.exercises, exerciseId];
      return { ...f, exercises };
    });
    setDirty(true);
  };

  const startNew = () => {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    setActiveId(null);
    setForm({ name: "", description: "", exercises: [] });
    setDirty(false);
  };

  const loadTemplate = (tpl) => {
    if (dirty && tpl._id !== activeId && !window.confirm("Discard unsaved changes?")) return;
    setActiveId(tpl._id);
    setForm({ name: tpl.name, description: tpl.description || "", exercises: tpl.exercises.map((e) => e._id) });
    setDirty(false);
  };

  const handleCreate = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await api.post("/admin/workout-templates", form);
      setTemplates((prev) => [res.data.data, ...prev]);
      setActiveId(res.data.data._id);
      setDirty(false);
    } catch (e) {
      setError(e.response?.data?.message || "Create failed");
    }
    setSaving(false);
  };

  const handleUpdate = async () => {
    if (!activeId) return;
    setSaving(true);
    setError("");
    try {
      const res = await api.put(`/admin/workout-templates/${activeId}`, form);
      setTemplates((prev) => prev.map((t) => (t._id === activeId ? res.data.data : t)));
      setDirty(false);
    } catch (e) {
      setError(e.response?.data?.message || "Update failed");
    }
    setSaving(false);
  };

  const handleDelete = async (tplId) => {
    if (!window.confirm("Delete this template?")) return;
    try {
      await api.delete(`/admin/workout-templates/${tplId}`);
      setTemplates((prev) => prev.filter((t) => t._id !== tplId));
      if (tplId === activeId) startNew();
    } catch (e) {
      setError("Delete failed");
    }
  };

  const handleDuplicate = async (tpl) => {
    try {
      const dup = {
        name: tpl.name + " Copy",
        description: tpl.description,
        exercises: tpl.exercises.map((e) => e._id),
      };
      const res = await api.post("/admin/workout-templates", dup);
      setTemplates((prev) => [res.data.data, ...prev]);
    } catch (e) {
      setError("Duplicate failed");
    }
  };

  const filteredTemplates = templates.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));
  const filteredExercises = allExercises.filter((e) => e.name.toLowerCase().includes(exerciseSearch.toLowerCase()));

  const toggleAllExercises = () => {
    setForm((f) => {
      if (f.exercises.length === filteredExercises.length) return { ...f, exercises: [] };
      return { ...f, exercises: filteredExercises.map((e) => e._id) };
    });
    setDirty(true);
  };

  const isEdit = !!activeId;
  const exerciseCount = form.exercises.length;

  const onFieldChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setDirty(true);
  };

  return (
    <div className="flex flex-col xl:grid xl:grid-cols-[260px_minmax(0,1fr)_380px] gap-4 h-full">
      {/* Column 1: Templates List */}
      <div className="flex flex-col bg-[var(--color-surface)] border border-[var(--color-primary)]/25 rounded-lg overflow-hidden">
        <div className="p-3 flex items-center gap-2 border-b border-[var(--color-primary)]/20 bg-[var(--color-background)]">
          <FiSearch className="text-text-secondary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates"
            className="flex-1 bg-transparent text-xs focus:outline-none text-text-main placeholder:text-text-secondary"
          />
          <button
            onClick={startNew}
            className="px-2 py-1 bg-primary hover:opacity-90 rounded text-[10px] text-white flex items-center gap-1"
          >
            <FiPlus /> New
          </button>
        </div>
        {loading ? (
          <div className="p-3 text-xs text-text-secondary">Loading...</div>
        ) : (
          <ul className="flex-1 overflow-y-auto text-xs divide-y divide-[var(--color-primary)]/10">
            {filteredTemplates.map((t) => {
              const active = t._id === activeId;
              return (
                <li
                  key={t._id}
                  className={`p-3 cursor-pointer group ${
                    active ? "bg-[var(--color-primary)]/15" : "hover:bg-[var(--color-background)]"
                  }`}
                  onClick={() => loadTemplate(t)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-main truncate">{t.name}</span>
                    <span className="text-[10px] text-text-secondary">{t.exercises.length}</span>
                  </div>
                  {active && (
                    <div className="mt-2 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(t);
                        }}
                        className="px-2 py-1 rounded flex items-center gap-1 bg-[var(--color-background)] hover:bg-[var(--color-surface)] border border-[var(--color-primary)]/20 text-text-main"
                      >
                        <FiCopy size={12} />
                        Dup
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(t._id);
                        }}
                        className="px-2 py-1 bg-red-600/70 hover:bg-red-600 rounded flex items-center gap-1 text-white"
                      >
                        <FiTrash2 size={12} />
                        Del
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
            {!filteredTemplates.length && <li className="p-3 text-text-secondary text-[11px]">No templates</li>}
          </ul>
        )}
      </div>

      {/* Column 2: Editor & Selected Exercises */}
      <div className="flex flex-col bg-[var(--color-surface)] border border-[var(--color-primary)]/25 rounded-lg p-4 overflow-hidden">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-primary">{isEdit ? "Edit Template" : "Create Template"}</h1>
            <p className="text-[11px] text-text-secondary">
              {isEdit ? "Modify and save changes" : "Define a new reusable workout template"}
            </p>
          </div>
          {dirty && (
            <span className="text-amber-400 text-[11px] flex items-center gap-1">
              <FiAlertTriangle /> Unsaved
            </span>
          )}
        </div>
        {error && (
          <div className="mb-3 text-status-danger text-[11px] bg-status-danger/10 border border-status-danger/30 px-2 py-1 rounded">
            {error}
          </div>
        )}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wide text-text-secondary">Name</label>
            <input
              value={form.name}
              onChange={(e) => onFieldChange("name", e.target.value)}
              className="w-full bg-[var(--color-background)] border border-[var(--color-primary)]/30 rounded px-3 py-2 text-xs text-text-main placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/60"
              placeholder="Push Day A"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wide text-text-secondary">Description</label>
            <input
              value={form.description}
              onChange={(e) => onFieldChange("description", e.target.value)}
              className="w-full bg-[var(--color-background)] border border-[var(--color-primary)]/30 rounded px-3 py-2 text-xs text-text-main placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/60"
              placeholder="Upper body push focus"
            />
          </div>
        </div>
        {/* Selected Exercises (sortable) */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wide text-text-secondary">Selected Exercises</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/30 text-white">{exerciseCount}</span>
            </div>
            {form.exercises.length > 1 && (
              <span className="text-[10px] text-text-secondary">Drag not enabled yet – use arrows</span>
            )}
          </div>
          <ul className="space-y-1 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {form.exercises.map((id, idx) => {
              const ex = allExercises.find((e) => e._id === id);
              if (!ex) return null;
              return (
                <li
                  key={id}
                  className="group flex items-center gap-2 bg-[var(--color-background)] border border-[var(--color-primary)]/20 rounded px-2 py-1 text-[11px] text-text-main"
                >
                  <span className="flex-1 truncate" title={ex.name}>
                    {idx + 1}. {ex.name}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      aria-label="Move up"
                      disabled={idx === 0}
                      onClick={() => moveExercise(idx, -1)}
                      className="p-1 disabled:opacity-30 hover:bg-[var(--color-surface)] rounded"
                    >
                      <FiArrowUp size={12} />
                    </button>
                    <button
                      aria-label="Move down"
                      disabled={idx === form.exercises.length - 1}
                      onClick={() => moveExercise(idx, 1)}
                      className="p-1 disabled:opacity-30 hover:bg-[var(--color-surface)] rounded"
                    >
                      <FiArrowDown size={12} />
                    </button>
                    <button
                      aria-label="Remove"
                      onClick={() => removeExerciseAt(idx)}
                      className="p-1 hover:bg-red-600/20 rounded text-red-500"
                    >
                      <FiMinusCircle size={12} />
                    </button>
                  </div>
                </li>
              );
            })}
            {!form.exercises.length && (
              <li className="text-text-secondary text-[11px] py-4 text-center bg-[var(--color-background)] rounded border border-[var(--color-primary)]/15">
                No exercises selected
              </li>
            )}
          </ul>
        </div>
        <div className="mt-4 flex items-center gap-2 bg-[var(--color-background)] rounded px-2 py-2 border border-[var(--color-primary)]/20">
          <FiSearch className="text-text-secondary" />
          <input
            value={exerciseSearch}
            onChange={(e) => setExerciseSearch(e.target.value)}
            placeholder="Search exercises"
            className="flex-1 bg-transparent text-xs focus:outline-none text-text-main placeholder:text-text-secondary"
          />
          <button
            onClick={toggleAllExercises}
            className="text-[10px] px-2 py-1 rounded bg-[var(--color-background)] hover:bg-[var(--color-surface)] border border-[var(--color-primary)]/20 text-text-main"
          >
            {form.exercises.length === filteredExercises.length ? "Clear" : "Add All"}
          </button>
          <button
            onClick={cycleDensity}
            className={`text-[10px] px-2 py-1 rounded border transition ${
              density === "ultra"
                ? "bg-primary hover:opacity-90 border-transparent text-white"
                : density === "compact"
                ? "bg-primary/70 hover:bg-primary/80 border-transparent text-white"
                : "bg-[var(--color-background)] hover:bg-[var(--color-surface)] border-[var(--color-primary)]/20 text-text-main"
            }`}
            title="Cycle density (ultra → compact → comfort)"
          >
            {density === "ultra" ? "Ultra" : density === "compact" ? "Compact" : "Comfort"}
          </button>
          <button
            onClick={() => setShowLibrary((s) => !s)}
            className="text-[10px] px-2 py-1 rounded bg-[var(--color-background)] hover:bg-[var(--color-surface)] border border-[var(--color-primary)]/20 xl:hidden flex items-center gap-1 text-text-main"
          >
            <FiList size={12} /> {showLibrary ? "Hide" : "Show"} Library
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {!isEdit && (
            <button
              disabled={saving || !form.name || !form.exercises.length}
              onClick={handleCreate}
              className="flex items-center gap-1 px-3 py-2 bg-primary hover:opacity-90 disabled:opacity-40 rounded text-xs font-semibold text-white"
            >
              <FiPlus size={12} />
              Create
            </button>
          )}
          {isEdit && (
            <button
              disabled={saving || !dirty}
              onClick={handleUpdate}
              className="flex items-center gap-1 px-3 py-2 bg-primary hover:opacity-90 disabled:opacity-40 rounded text-xs font-semibold text-white"
            >
              <FiSave size={12} />
              Save
            </button>
          )}
          {isEdit && (
            <button
              onClick={() => handleDelete(activeId)}
              className="flex items-center gap-1 px-3 py-2 bg-red-600/70 hover:bg-red-600 rounded text-xs font-semibold text-white"
            >
              <FiTrash2 size={12} />
              Delete
            </button>
          )}
          <button
            onClick={startNew}
            className="flex items-center gap-1 px-3 py-2 rounded text-xs bg-[var(--color-background)] hover:bg-[var(--color-surface)] border border-[var(--color-primary)]/20 text-text-main"
          >
            <FiX size={12} />
            Reset
          </button>
        </div>
      </div>

      {/* Column 3: Exercise Library */}
      <div
        className={`flex flex-col bg-[var(--color-surface)] border border-[var(--color-primary)]/25 rounded-lg p-3 overflow-hidden ${
          showLibrary ? "" : "hidden xl:flex"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-semibold tracking-wide text-text-main flex items-center gap-1">
            <FiSearch className="text-text-secondary" /> Library
          </h2>
          <span className="text-[10px] text-text-secondary">{filteredExercises.length}</span>
        </div>
        <div
          className={`h-full overflow-y-auto rounded border border-[var(--color-primary)]/20 ${
            density === "ultra" ? "p-1" : density === "compact" ? "p-1.5" : "p-2"
          } grid ${density === "ultra" ? "gap-[2px]" : density === "compact" ? "gap-[3px]" : "gap-1.5"}
          ${
            density === "ultra"
              ? "grid-cols-[repeat(auto-fill,minmax(110px,1fr))]"
              : density === "compact"
              ? "grid-cols-[repeat(auto-fill,minmax(130px,1fr))]"
              : "sm:grid-cols-2 md:grid-cols-3"
          } bg-[var(--color-background)]`}
        >
          {filteredExercises.map((ex) => {
            const active = form.exercises.includes(ex._id);
            const base =
              density === "ultra"
                ? "text-[11px] h-6 px-1.5 rounded-[4px]"
                : density === "compact"
                ? "text-[11px] h-7 px-2 rounded-[5px]"
                : "text-[12px] h-8 px-3 rounded";
            return (
              <button
                key={ex._id}
                onClick={() => handleExerciseToggle(ex._id)}
                className={`${base} flex items-center text-left transition overflow-hidden text-ellipsis focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/60 ${
                  active
                    ? density === "comfort"
                      ? "bg-primary/80 border border-[var(--color-primary)]/60 text-white"
                      : density === "compact"
                      ? "bg-primary/80 text-white font-medium"
                      : "bg-primary text-white font-semibold"
                    : density === "comfort"
                    ? "bg-[var(--color-background)] border border-[var(--color-primary)]/20 hover:bg-[var(--color-surface)] text-text-main"
                    : density === "compact"
                    ? "bg-[var(--color-background)] hover:bg-[var(--color-surface)] text-text-main"
                    : "bg-[var(--color-background)] hover:bg-[var(--color-surface)] text-text-main"
                } `}
                title={ex.name}
              >
                {ex.name}
              </button>
            );
          })}
          {!filteredExercises.length && (
            <div className="text-text-secondary text-[11px] col-span-full py-4 text-center">No exercises</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTemplatesPage;
