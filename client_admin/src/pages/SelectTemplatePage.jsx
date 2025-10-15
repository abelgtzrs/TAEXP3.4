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

  if (loading) return <p className="text-text-secondary">Loading templates...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Select a Prebuilt Workout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          // This Link navigates to the logging page.
          // The 'state' prop is a powerful feature of React Router for passing
          // complex data to the next page without using URL parameters.
          <Link
            key={template._id}
            to="/workouts/log"
            state={{ templateData: template }} // Passing the chosen template data
            className="p-6 rounded-lg border-2 transition-all duration-300 block"
            style={{ background: "var(--color-surface)", borderColor: "transparent" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
          >
            <h2 className="text-xl font-bold text-primary mb-2">{template.name}</h2>
            <p className="text-text-secondary text-sm mb-4">{template.description}</p>
            <ul className="text-xs text-text-main list-disc list-inside">
              {/* Display the names of the exercises in the template */}
              {template.exercises.map((ex) => (
                <li key={ex._id}>{ex.name}</li>
              ))}
            </ul>
          </Link>
        ))}
        {templates.length === 0 && (
          <p className="text-text-secondary col-span-full">No workout templates have been created yet.</p>
        )}
      </div>
    </div>
  );
};

export default SelectTemplatePage;
