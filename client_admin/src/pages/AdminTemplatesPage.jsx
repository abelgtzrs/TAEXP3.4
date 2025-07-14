// src/pages/AdminTemplatesPage.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api";

const AdminTemplatesPage = () => {
  // State for existing templates and all possible exercises
  const [templates, setTemplates] = useState([]);
  const [allExercises, setAllExercises] = useState([]);

  // State for the creation form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [templatesRes, exercisesRes] = await Promise.all([api.get("/workout-templates"), api.get("/exercises")]);
    setTemplates(templatesRes.data.data);
    setAllExercises(exercisesRes.data.data);
  };

  const handleCheckboxChange = (exerciseId) => {
    setSelectedExercises(
      (prev) =>
        prev.includes(exerciseId)
          ? prev.filter((id) => id !== exerciseId) // Uncheck: remove from array
          : [...prev, exerciseId] // Check: add to array
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/workout-templates", {
        name,
        description,
        exercises: selectedExercises,
      });
      setName("");
      setDescription("");
      setSelectedExercises([]);
      fetchData(); // Refresh list
    } catch (error) {
      alert("Failed to create template.");
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
        Manage Workout Templates
      </motion.h1>

      {/* Form to create new templates */}
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.005, transition: { duration: 0.2 } }}
        onSubmit={handleSubmit}
        className="mb-8 p-6 bg-gray-800 rounded-lg"
      >
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-xl text-white font-semibold mb-4"
        >
          Create New Template
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-4"
        >
          <motion.input
            whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
            type="text"
            placeholder="Template Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 bg-gray-700 rounded"
          />
          <motion.input
            whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded"
          />

          <div>
            <motion.h3
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="text-lg text-white mb-2"
            >
              Select Exercises
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="max-h-60 overflow-y-auto p-3 bg-gray-900 rounded-md grid grid-cols-2 md:grid-cols-3 gap-2"
            >
              {allExercises.map((ex, index) => (
                <motion.label
                  key={ex._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 + index * 0.02 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedExercises.includes(ex._id)}
                    onChange={() => handleCheckboxChange(ex._id)}
                    className="form-checkbox bg-gray-600 text-teal-500"
                  />
                  <span>{ex.name}</span>
                </motion.label>
              ))}
            </motion.div>
          </div>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.0 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg"
        >
          Create Template
        </motion.button>
      </motion.form>

      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="text-2xl font-semibold text-white mt-10 mb-4"
      >
        Existing Templates
      </motion.h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="space-y-4"
      >
        {templates.map((template, index) => (
          <motion.div
            key={template._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.5 + index * 0.1 }}
            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            className="p-4 bg-gray-800 rounded-lg"
          >
            <h3 className="font-bold text-white">{template.name}</h3>
            <ul className="text-xs text-gray-400 list-disc list-inside">
              {template.exercises.map((ex) => (
                <li key={ex._id}>{ex.name}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AdminTemplatesPage;
