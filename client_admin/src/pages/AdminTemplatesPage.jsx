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
      <div className="flex flex-col bg-gray-900/60 border border-white/10 rounded-lg overflow-hidden">
        <div className="p-3 flex items-center gap-2 border-b border-white/10 bg-gray-800/60">
          <FiSearch className="text-white/50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates"
            className="flex-1 bg-transparent text-xs focus:outline-none text-white"
          />
          <button
            onClick={startNew}
            className="px-2 py-1 bg-primary/40 hover:bg-primary/60 rounded text-[10px] flex items-center gap-1"
          >
            <FiPlus /> New
          </button>
        </div>
        {loading ? (
          <div className="p-3 text-xs">Loading...</div>
        ) : (
          <ul className="flex-1 overflow-y-auto text-xs divide-y divide-white/5">
            {filteredTemplates.map((t) => {
              const active = t._id === activeId;
              return (
                <li
                  key={t._id}
                  className={`p-3 cursor-pointer group ${active ? "bg-primary/20" : "hover:bg-white/5"}`}
                  onClick={() => loadTemplate(t)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white truncate">{t.name}</span>
                    <span className="text-[10px] text-white/40">{t.exercises.length}</span>
                  </div>
                  {active && (
                    <div className="mt-2 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(t);
                        }}
                        className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded flex items-center gap-1"
                      >
                        <FiCopy size={12} />
                        Dup
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(t._id);
                        }}
                        className="px-2 py-1 bg-red-600/60 hover:bg-red-600 rounded flex items-center gap-1"
                      >
                        <FiTrash2 size={12} />
                        Del
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
            {!filteredTemplates.length && <li className="p-3 text-white/40 text-[11px]">No templates</li>}
          </ul>
        )}
      </div>

      {/* Column 2: Editor & Selected Exercises */}
      <div className="flex flex-col bg-gray-900/40 border border-white/10 rounded-lg p-4 overflow-hidden">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-white">{isEdit ? "Edit Template" : "Create Template"}</h1>
            <p className="text-[11px] text-white/40">
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
            <label className="text-[10px] uppercase tracking-wide text-white/60">Name</label>
            <input
              value={form.name}
              onChange={(e) => onFieldChange("name", e.target.value)}
              className="w-full bg-gray-800/70 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/60"
              placeholder="Push Day A"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wide text-white/60">Description</label>
            <input
              value={form.description}
              onChange={(e) => onFieldChange("description", e.target.value)}
              className="w-full bg-gray-800/70 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/60"
              placeholder="Upper body push focus"
            />
          </div>
        </div>
        {/* Selected Exercises (sortable) */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wide text-white/60">Selected Exercises</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/30 text-white/80">{exerciseCount}</span>
            </div>
            {form.exercises.length > 1 && (
              <span className="text-[10px] text-white/30">Drag not enabled yet – use arrows</span>
            )}
          </div>
          <ul className="space-y-1 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {form.exercises.map((id, idx) => {
              const ex = allExercises.find((e) => e._id === id);
              if (!ex) return null;
              return (
                <li
                  key={id}
                  className="group flex items-center gap-2 bg-gray-800/50 border border-white/5 rounded px-2 py-1 text-[11px] text-white/80"
                >
                  <span className="flex-1 truncate" title={ex.name}>
                    {idx + 1}. {ex.name}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      aria-label="Move up"
                      disabled={idx === 0}
                      onClick={() => moveExercise(idx, -1)}
                      className="p-1 disabled:opacity-30 hover:bg-white/10 rounded"
                    >
                      <FiArrowUp size={12} />
                    </button>
                    <button
                      aria-label="Move down"
                      disabled={idx === form.exercises.length - 1}
                      onClick={() => moveExercise(idx, 1)}
                      className="p-1 disabled:opacity-30 hover:bg-white/10 rounded"
                    >
                      <FiArrowDown size={12} />
                    </button>
                    <button
                      aria-label="Remove"
                      onClick={() => removeExerciseAt(idx)}
                      className="p-1 hover:bg-red-600/50 rounded text-red-400"
                    >
                      <FiMinusCircle size={12} />
                    </button>
                  </div>
                </li>
              );
            })}
            {!form.exercises.length && (
              <li className="text-white/40 text-[11px] py-4 text-center bg-white/5 rounded">No exercises selected</li>
            )}
          </ul>
        </div>
        <div className="mt-4 flex items-center gap-2 bg-gray-800/60 rounded px-2 py-2">
          <FiSearch className="text-white/40" />
          <input
            value={exerciseSearch}
            onChange={(e) => setExerciseSearch(e.target.value)}
            placeholder="Search exercises"
            className="flex-1 bg-transparent text-xs focus:outline-none"
          />
          <button onClick={toggleAllExercises} className="text-[10px] px-2 py-1 rounded bg-white/10 hover:bg-white/20">
            {form.exercises.length === filteredExercises.length ? "Clear" : "Add All"}
          </button>
          <button
            onClick={cycleDensity}
            className={`text-[10px] px-2 py-1 rounded border border-white/10 transition ${
              density === "ultra"
                ? "bg-primary/60 hover:bg-primary/70"
                : density === "compact"
                ? "bg-primary/30 hover:bg-primary/40"
                : "bg-white/5 hover:bg-white/10"
            }`}
            title="Cycle density (ultra → compact → comfort)"
          >
            {density === "ultra" ? "Ultra" : density === "compact" ? "Compact" : "Comfort"}
          </button>
          <button
            onClick={() => setShowLibrary((s) => !s)}
            className="text-[10px] px-2 py-1 rounded bg-white/10 hover:bg-white/20 xl:hidden flex items-center gap-1"
          >
            <FiList size={12} /> {showLibrary ? "Hide" : "Show"} Library
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {!isEdit && (
            <button
              disabled={saving || !form.name || !form.exercises.length}
              onClick={handleCreate}
              className="flex items-center gap-1 px-3 py-2 bg-primary/60 hover:bg-primary/80 disabled:opacity-40 rounded text-xs font-semibold text-white"
            >
              <FiPlus size={12} />
              Create
            </button>
          )}
          {isEdit && (
            <button
              disabled={saving || !dirty}
              onClick={handleUpdate}
              className="flex items-center gap-1 px-3 py-2 bg-emerald-600/70 hover:bg-emerald-600 disabled:opacity-40 rounded text-xs font-semibold text-white"
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
            className="flex items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-xs text-white"
          >
            <FiX size={12} />
            Reset
          </button>
        </div>
      </div>

      {/* Column 3: Exercise Library */}
      <div
        className={`flex flex-col bg-gray-900/40 border border-white/10 rounded-lg p-3 overflow-hidden ${
          showLibrary ? "" : "hidden xl:flex"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-semibold tracking-wide text-white/70 flex items-center gap-1">
            <FiSearch className="opacity-60" /> Library
          </h2>
          <span className="text-[10px] text-white/40">{filteredExercises.length}</span>
        </div>
        <div
          className={`h-full overflow-y-auto rounded border border-white/10 ${
            density === "ultra" ? "p-1" : density === "compact" ? "p-1.5" : "p-2"
          } grid ${density === "ultra" ? "gap-[2px]" : density === "compact" ? "gap-[3px]" : "gap-1.5"}
          ${
            density === "ultra"
              ? "grid-cols-[repeat(auto-fill,minmax(110px,1fr))]"
              : density === "compact"
              ? "grid-cols-[repeat(auto-fill,minmax(130px,1fr))]"
              : "sm:grid-cols-2 md:grid-cols-3"
          } bg-gray-950/40`}
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
                className={`${base} flex items-center text-left transition overflow-hidden text-ellipsis focus:outline-none focus:ring-1 focus:ring-primary/60 ${
                  active
                    ? density === "comfort"
                      ? "bg-primary/45 border border-primary/60 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                      : density === "compact"
                      ? "bg-primary/70 text-white font-medium"
                      : "bg-primary/80 text-white font-semibold"
                    : density === "comfort"
                    ? "bg-white/5 border border-white/10 hover:bg-white/10 text-white/75 hover:text-white"
                    : density === "compact"
                    ? "bg-white/5 hover:bg-white/15 text-white/70 hover:text-white"
                    : "bg-white/5 hover:bg-white/20 text-white/65 hover:text-white"
                } `}
                title={ex.name}
              >
                {ex.name}
              </button>
            );
          })}
          {!filteredExercises.length && (
            <div className="text-white/40 text-[11px] col-span-full py-4 text-center">No exercises</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTemplatesPage;
