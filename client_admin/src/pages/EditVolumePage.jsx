// src/pages/EditVolumePage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import VolumeForm from "../components/volumes/VolumeForm"; // Import our new reusable form

const EditVolumePage = () => {
  // Get the volumeId from the URL (e.g., /admin/volumes/edit/some_id)
  const { volumeId } = useParams();
  const navigate = useNavigate(); // Hook to programmatically navigate

  const [volume, setVolume] = useState(null); // State to hold the fetched volume data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the specific volume's data when the page loads
  useEffect(() => {
    const fetchVolume = async () => {
      try {
        const response = await api.get(`/admin/volumes/${volumeId}`);
        setVolume(response.data.data);
      } catch (err) {
        setError("Failed to fetch volume data.");
      } finally {
        setLoading(false);
      }
    };
    fetchVolume();
  }, [volumeId]); // Rerun this effect if the volumeId in the URL ever changes

  // This function will be called when the form is submitted
  const handleUpdateVolume = async (formData) => {
    try {
      setLoading(true);
      await api.put(`/admin/volumes/${volumeId}`, formData);
      // After successfully updating, redirect the admin back to the main list
      navigate("/admin/volumes");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update volume.");
      setLoading(false);
    }
  };

  if (loading) return <p className="text-white">Loading volume...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin/volumes" className="text-teal-400 hover:text-teal-300">
          &larr; Back to Volume Manager
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-white mb-4">
        Editing:{" "}
        <span className="text-teal-400">
          Volume {volume?.volumeNumber} - {volume?.title}
        </span>
      </h1>

      {/* We render our reusable form, passing the existing volume data and the update handler */}
      <VolumeForm
        initialData={volume}
        onSubmit={handleUpdateVolume}
        loading={loading}
        submitButtonText="Update Volume"
      />
    </div>
  );
};

export default EditVolumePage;
