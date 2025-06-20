// src/pages/VolumesPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link
import api from "../services/api";
import VolumeForm from "../components/volumes/VolumeForm"; // Import the refactored form

const VolumesPage = () => {
  // ... (useState and fetchVolumes logic remains the same) ...
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false); // Separate loading state for the form
  const [error, setError] = useState("");

  const fetchVolumes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/volumes");
      setVolumes(response.data.data);
    } catch (err) {
      setError("Failed to fetch volumes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolumes();
  }, []);

  const handleCreateVolume = async (volumeData) => {
    try {
      setFormLoading(true);
      await api.post("/admin/volumes", volumeData);
      await fetchVolumes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create volume.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteVolume = async (volumeId) => {
    if (
      window.confirm("Are you sure you want to permanently delete this volume?")
    ) {
      try {
        await api.delete(`/admin/volumes/${volumeId}`);
        await fetchVolumes();
      } catch (err) {
        setError("Failed to delete volume.");
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-teal-400 mb-6">
        Greentext Volume Manager
      </h1>

      {/* We now use our reusable VolumeForm for creating */}
      <VolumeForm
        onSubmit={handleCreateVolume}
        loading={formLoading}
        submitButtonText="Create Volume"
      />

      <h2 className="text-2xl font-semibold text-white mt-10 mb-4">
        Existing Volumes
      </h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="min-w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-900 text-xs uppercase">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {volumes.map((vol) => (
              <tr
                key={vol._id}
                className="border-b border-gray-700 hover:bg-gray-700/50"
              >
                <td className="p-3 font-bold">{vol.volumeNumber}</td>
                <td className="p-3">{vol.title}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      vol.status === "published"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {vol.status}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(vol.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 space-x-4">
                  {/* LINK TO THE NEW EDIT PAGE */}
                  <Link
                    to={`/admin/volumes/edit/${vol._id}`}
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteVolume(vol._id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolumesPage;
