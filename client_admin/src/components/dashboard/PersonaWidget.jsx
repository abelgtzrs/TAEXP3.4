import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Widget from "../ui/Widget";
import { Check } from "lucide-react";

const PersonaWidget = () => {
  const { user, setUser } = useAuth();

  const unlockedPersonas = user?.unlockedAbelPersonas || [];
  const activePersonaId = user?.activeAbelPersona?._id || null;

  const handleSelectPersona = async (personaId) => {
    if (personaId === activePersonaId) return;

    try {
      const response = await api.put("/users/me/profile/active-persona", { personaId });
      setUser(response.data.data);
    } catch (error) {
      console.error("Failed to set active persona:", error);
      alert("Could not set active persona.");
    }
  };

  return (
    <Widget title="Active Persona">
      <div className="grid grid-cols-2 gap-3">
        {/* Default/Standard Issue Persona Button */}
        <button
          onClick={() => handleSelectPersona(null)}
          className={`p-3 rounded-lg border-2 text-left transition-all duration-200
                        ${
                          !activePersonaId
                            ? "bg-primary/20 border-primary"
                            : "bg-surface border-gray-700 hover:border-gray-500"
                        }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-text-main">Standard Issue</span>
            {!activePersonaId && <Check size={16} className="text-primary" />}
          </div>
          <p className="text-xs text-text-secondary mt-1">Default theme.</p>
        </button>

        {/* Map over unlocked personas */}
        {unlockedPersonas.map((persona) => {
          const isActive = activePersonaId === persona._id;
          return (
            <button
              key={persona._id}
              onClick={() => handleSelectPersona(persona._id)}
              className={`p-3 rounded-lg border-2 text-left transition-all duration-200
                                ${isActive ? "border-primary" : "bg-surface border-gray-700 hover:border-gray-500"}`}
              style={{ borderColor: isActive ? persona.colors.primary : "" }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-text-main">{persona.name}</span>
                {isActive && <Check size={16} style={{ color: persona.colors.primary }} />}
              </div>
              <p className="text-xs text-text-secondary mt-1 truncate">{persona.description}</p>
            </button>
          );
        })}
      </div>
    </Widget>
  );
};

export default PersonaWidget;
