// src/pages/SelectTemplatePage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const SelectTemplatePage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // Fetch the list of workout templates from our backend.
        const response = await api.get("/workout-templates");
        setTemplates(response.data.data);
      } catch (err) {
        setError("Failed to load workout templates.");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  if (loading) return <p className="text-gray-400">Loading templates...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-teal-400 mb-6">
        Select a Prebuilt Workout
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          // This Link navigates to the logging page.
          // The 'state' prop is a powerful feature of React Router for passing
          // complex data to the next page without using URL parameters.
          <Link
            key={template._id}
            to="/workouts/log"
            state={{ templateData: template }} // Passing the chosen template data
            className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 hover:border-teal-500 border-2 border-transparent transition-all duration-300 block"
          >
            <h2 className="text-xl font-bold text-white mb-2">
              {template.name}
            </h2>
            <p className="text-gray-400 text-sm mb-4">{template.description}</p>
            <ul className="text-xs text-gray-300 list-disc list-inside">
              {/* Display the names of the exercises in the template */}
              {template.exercises.map((ex) => (
                <li key={ex._id}>{ex.name}</li>
              ))}
            </ul>
          </Link>
        ))}
        {templates.length === 0 && (
          <p className="text-gray-500 col-span-full">
            No workout templates have been created yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default SelectTemplatePage;
