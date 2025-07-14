// src/pages/AdminExercisesPage.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import { CheckSquare, Trash2, Edit, PlusCircle } from "lucide-react";

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
const INITIAL_FORM_STATE = {
  name: "",
  description: "",
  exerciseType: "Strength",
  muscleGroups: [],
  equipment: [],
  defaultMetrics: [
    { name: "weight", unit: "kg" },
    { name: "reps", unit: "count" },
  ],
};

const AdminExercisesPage = () => {
  // --- State Management ---
  const [exercises, setExercises] = useState([]); // For the list of all exercises
  const [formData, setFormData] = useState(INITIAL_FORM_STATE); // A single object for all form fields
  const [editingId, setEditingId] = useState(null); // To track if we are editing or creating
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    setFormData({ ...formData, defaultMetrics: newMetrics });
  };

  // Adds a new blank metric row to the form.
  const addMetric = () => {
    setFormData({
      ...formData,
      defaultMetrics: [...formData.defaultMetrics, { name: "", unit: "" }],
    });
  };

  // Removes a metric row from the form.
  const removeMetric = (index) => {
    const newMetrics = formData.defaultMetrics.filter((_, i) => i !== index);
    setFormData({ ...formData, defaultMetrics: newMetrics });
  };

  // --- Main Actions ---

  // Populates the form when an "Edit" button is clicked.
  const handleEditClick = (exercise) => {
    setEditingId(exercise._id);
    setFormData({
      name: exercise.name,
      description: exercise.description,
      exerciseType: exercise.exerciseType,
      muscleGroups: exercise.muscleGroups || [],
      equipment: exercise.equipment || [],
      defaultMetrics: exercise.defaultMetrics || [],
    });
    // Scroll to the form for a better user experience.
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clears the form and resets it to "Create" mode.
  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setEditingId(null);
  };

  // Handles form submission for both creating and updating.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        // If we have an editingId, we are updating.
        await api.put(`/admin/exercises/${editingId}`, formData);
      } else {
        // Otherwise, we are creating a new one.
        await api.post("/admin/exercises", formData);
      }
      resetForm();
      await fetchExercises(); // Refresh the list
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-bold text-teal-400 mb-6"
      >
        Manage Exercise Definitions
      </motion.h1>

      {/* --- The Enhanced Form --- */}
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.005, transition: { duration: 0.2 } }}
        onSubmit={handleSubmit}
        className="mb-8 p-6 bg-gray-800 rounded-lg"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl text-white font-semibold mb-4">{editingId ? "Edit Exercise" : "Add New Exercise"}</h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-sm text-teal-400 hover:text-teal-300">
              Cancel Edit
            </button>
          )}
        </div>

        {/* Name, Description, Type */}
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Exercise Name"
            value={formData.name}
            onChange={handleFormChange}
            required
            className="w-full p-3 bg-gray-700 rounded border-gray-600 text-white"
          />
          <textarea
            name="description"
            placeholder="Description, tips, indications..."
            value={formData.description}
            onChange={handleFormChange}
            className="w-full p-3 bg-gray-700 rounded border-gray-600 text-white h-24"
          />
          <select
            name="exerciseType"
            value={formData.exerciseType}
            onChange={handleFormChange}
            className="w-full p-3 bg-gray-700 rounded border-gray-600 text-white"
          >
            {EXERCISE_TYPE_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Muscle Groups Checkboxes */}
        <div className="mt-4">
          <h3 className="text-lg text-white mb-2">Muscle Groups</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {MUSCLE_GROUP_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.muscleGroups.includes(opt)}
                  onChange={() => handleCheckboxChange("muscleGroups", opt)}
                  className="form-checkbox bg-gray-600 text-teal-500 border-gray-500"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Equipment Checkboxes */}
        <div className="mt-4">
          <h3 className="text-lg text-white mb-2">Equipment</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {EQUIPMENT_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.equipment.includes(opt)}
                  onChange={() => handleCheckboxChange("equipment", opt)}
                  className="form-checkbox bg-gray-600 text-teal-500 border-gray-500"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Default Metrics Dynamic Form */}
        <div className="mt-4">
          <h3 className="text-lg text-white mb-2">Default Metrics to Track</h3>
          <div className="space-y-2">
            {formData.defaultMetrics.map((metric, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Metric Name (e.g., weight)"
                  value={metric.name}
                  onChange={(e) => handleMetricChange(index, "name", e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded"
                />
                <input
                  type="text"
                  placeholder="Unit (e.g., kg)"
                  value={metric.unit}
                  onChange={(e) => handleMetricChange(index, "unit", e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded"
                />
                <button
                  type="button"
                  onClick={() => removeMetric(index)}
                  className="p-2 bg-red-800 hover:bg-red-700 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addMetric}
            className="mt-2 flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300"
          >
            <PlusCircle size={16} /> Add Metric
          </button>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-red-400 text-sm mt-4"
          >
            {error}
          </motion.p>
        )}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg"
        >
          {editingId ? "Update Definition" : "Create Definition"}
        </motion.button>
      </motion.form>

      {/* --- Table of existing definitions --- */}
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-2xl font-semibold text-white mt-10 mb-4"
      >
        Existing Exercises
      </motion.h2>

      {loading && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Loading...
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        whileHover={{ scale: 1.005, transition: { duration: 0.2 } }}
        className="bg-gray-800 rounded-lg overflow-hidden"
      >
        <table className="min-w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-900 text-xs uppercase">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Muscle Groups</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((ex, index) => (
              <motion.tr
                key={ex._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1.2 + index * 0.05 }}
                whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)", transition: { duration: 0.2 } }}
                className="border-b border-gray-700"
              >
                <td className="p-3 font-medium">{ex.name}</td>
                <td className="p-3">{ex.exerciseType}</td>
                <td className="p-3 text-xs">{ex.muscleGroups.join(", ")}</td>
                <td className="p-3 space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEditClick(ex)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(ex._id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Delete
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default AdminExercisesPage;
