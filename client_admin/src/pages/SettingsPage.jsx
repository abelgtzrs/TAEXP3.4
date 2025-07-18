import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import Widget from "../components/ui/Widget";

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  // The unlockedPersonas array should now be populated with full objects
  const unlockedPersonas = user?.unlockedAbelPersonas || [];
  const activePersonaId = user?.activeAbelPersona?._id || null;

  const handleSelectPersona = async (personaId) => {
    // Prevent API call if the selected persona is already active.
    if (personaId === activePersonaId) return;

    try {
      const response = await api.put("/users/me/profile/active-persona", { personaId });
      // The API now returns the fully updated and populated user object.
      // We use it to update our global state, which will trigger the theme change.
      setUser(response.data.data);
    } catch (error) {
      console.error("Failed to set active persona:", error);
      alert("Could not set active persona.");
    }
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure your Cognitive Framework experience." />

      <Widget title="Select Active Persona">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Button to reset to the default theme */}
          <div
            onClick={() => handleSelectPersona(null)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              !activePersonaId ? "border-primary" : "border-gray-700 hover:border-gray-500"
            }`}
          >
            <h3 className="font-bold text-white">Standard Issue</h3>
            <p className="text-xs text-text-secondary">The default system theme.</p>
          </div>

          {/* Map over unlocked personas to create a button for each */}
          {unlockedPersonas.map((persona) => (
            <div
              key={persona._id}
              onClick={() => handleSelectPersona(persona._id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                activePersonaId === persona._id ? "border-primary" : "border-gray-700 hover:border-gray-500"
              }`}
              style={{ borderColor: activePersonaId === persona._id ? persona.colors.primary : "" }}
            >
              <h3 className="font-bold text-white">{persona.name}</h3>
              <p className="text-xs text-text-secondary">{persona.description}</p>
            </div>
          ))}
        </div>
      </Widget>
    </div>
  );
};

export default SettingsPage;
