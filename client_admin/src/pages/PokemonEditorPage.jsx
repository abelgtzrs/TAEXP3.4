import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import StyledButton from "../components/ui/StyledButton";
import { Trash2, PlusCircle } from "lucide-react";

// A reusable input component with a label to keep the form clean
const InputWithLabel = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-xs font-medium text-text-secondary mb-1">
      {label}
    </label>
    <input id={id} className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-text-main" {...props} />
  </div>
);

const PokemonEditorPage = () => {
  const navigate = useNavigate();

  const [allPokemonList, setAllPokemonList] = useState([]);
  const [selectedPokemonId, setSelectedPokemonId] = useState("");

  const [pokemon, setPokemon] = useState(null);
  const [changeLogs, setChangeLogs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch the list of all Pokémon for the dropdown on initial load
  useEffect(() => {
    const fetchAllPokemonNames = async () => {
      try {
        const response = await api.get("/pokemon/base");
        const nameList = response.data.data
          .map((p) => ({ _id: p._id, name: p.name, speciesId: p.speciesId }))
          .sort((a, b) => a.speciesId - b.speciesId);
        setAllPokemonList(nameList);
      } catch (err) {
        setError("Failed to load Pokémon list.");
      }
    };
    fetchAllPokemonNames();
  }, []);

  // This effect runs whenever a new Pokémon is selected from the dropdown
  useEffect(() => {
    if (!selectedPokemonId) {
      setPokemon(null);
      return;
    }

    const fetchPokemonDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const [pokemonRes, logsRes] = await Promise.all([
          api.get(`/admin/pokemon/${selectedPokemonId}`),
          api.get(`/admin/pokemon/${selectedPokemonId}/logs`),
        ]);
        setPokemon(pokemonRes.data.data);
        setChangeLogs(logsRes.data.data);
      } catch (err) {
        setError("Failed to fetch selected Pokémon data.");
        setPokemon(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemonDetails();
  }, [selectedPokemonId]);

  // --- FULLY IMPLEMENTED HANDLER FUNCTIONS ---

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPokemon((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFormChange = (formIndex, field, value) => {
    const newForms = [...pokemon.forms];
    newForms[formIndex][field] = value;
    setPokemon((prev) => ({ ...prev, forms: newForms }));
  };

  const handleEvolutionPathChange = (pathIndex, field, value) => {
    const newPaths = [...pokemon.evolutionPaths];
    const parsedValue = field === "toSpeciesId" ? Number(value) : value;
    newPaths[pathIndex][field] = parsedValue;
    setPokemon((prev) => ({ ...prev, evolutionPaths: newPaths }));
  };

  const addForm = () => {
    setPokemon((prev) => ({
      ...prev,
      forms: [
        ...prev.forms,
        { formName: "New Form", types: pokemon.baseTypes, spriteGen5Animated: "", spriteGen6Animated: "" },
      ],
    }));
  };

  const removeForm = (index) => {
    setPokemon((prev) => ({ ...prev, forms: prev.forms.filter((_, i) => i !== index) }));
  };

  const addEvolutionPath = () => {
    setPokemon((prev) => ({
      ...prev,
      evolutionPaths: [...prev.evolutionPaths, { toSpeciesId: 0, method: "level-up", detail: "" }],
    }));
  };

  const removeEvolutionPath = (index) => {
    setPokemon((prev) => ({ ...prev, evolutionPaths: prev.evolutionPaths.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/admin/pokemon/${selectedPokemonId}`, pokemon);
      alert("Pokémon updated successfully!");
      const logsRes = await api.get(`/admin/pokemon/${selectedPokemonId}/logs`);
      setChangeLogs(logsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update Pokémon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Pokémon Database Editor" subtitle="Select a Pokémon to view and modify its data." />

      <div className="mb-8">
        <select
          value={selectedPokemonId}
          onChange={(e) => setSelectedPokemonId(e.target.value)}
          className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-text-main"
        >
          <option value="">-- Select a Pokémon to Edit --</option>
          {allPokemonList.map((p) => (
            <option key={p._id} value={p._id}>
              #{String(p.speciesId).padStart(3, "0")} - {p.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-white text-center">Loading Data...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {pokemon && !loading && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- Basic Info Section --- */}
          <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputWithLabel label="Name" id="name" name="name" value={pokemon.name} onChange={handleInputChange} />
              <InputWithLabel
                label="Generation"
                id="generation"
                name="generation"
                type="number"
                value={pokemon.generation}
                onChange={handleInputChange}
              />
              <InputWithLabel
                label="Evolution Stage"
                id="evolutionStage"
                name="evolutionStage"
                type="number"
                value={pokemon.evolutionStage}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-xs font-medium text-text-secondary mt-4 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={pokemon.description}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 rounded"
                rows="3"
              />
            </div>
            <div className="flex gap-6 mt-4 text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isStarter"
                  checked={pokemon.isStarter}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 bg-gray-700 text-primary focus:ring-primary"
                />{" "}
                Is Starter
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isLegendary"
                  checked={pokemon.isLegendary}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 bg-gray-700 text-primary focus:ring-primary"
                />{" "}
                Is Legendary
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isMythical"
                  checked={pokemon.isMythical}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 bg-gray-700 text-primary focus:ring-primary"
                />{" "}
                Is Mythical
              </label>
            </div>
          </div>

          {/* --- Forms Section --- */}
          <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Forms</h3>
            <div className="space-y-4">
              {pokemon.forms.map((form, index) => (
                <div key={index} className="p-4 bg-gray-900/50 rounded-md border border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <InputWithLabel
                        label="Form Name"
                        id={`formName-${index}`}
                        value={form.formName}
                        onChange={(e) => handleFormChange(index, "formName", e.target.value)}
                      />
                      <InputWithLabel
                        label="Gen 5 Sprite URL (Animated)"
                        id={`sprite5-${index}`}
                        value={form.spriteGen5Animated}
                        onChange={(e) => handleFormChange(index, "spriteGen5Animated", e.target.value)}
                      />
                      <InputWithLabel
                        label="Gen 6 Sprite URL (Animated)"
                        id={`sprite6-${index}`}
                        value={form.spriteGen6Animated}
                        onChange={(e) => handleFormChange(index, "spriteGen6Animated", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center bg-background p-2 rounded-md">
                      <div className="flex gap-4">
                        <img
                          src={form.spriteGen5Animated || "https://placehold.co/96x96/161B22/4B5563?text=N/A"}
                          alt="Gen 5 Sprite"
                          className="w-24 h-24 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/96x96/161B22/4B5563?text=Invalid";
                          }}
                        />
                        <img
                          src={form.spriteGen6Animated || "https://placehold.co/96x96/161B22/4B5563?text=N/A"}
                          alt="Gen 6 Sprite"
                          className="w-24 h-24 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/96x96/161B22/4B5563?text=Invalid";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeForm(index)}
                    className="mt-4 text-red-500 hover:text-red-400 text-xs flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Remove Form
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addForm} className="mt-4 text-teal-400 flex items-center gap-2">
              <PlusCircle size={16} /> Add New Form
            </button>
          </div>

          {/* --- Evolution Paths Section --- */}
          <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Evolution Paths</h3>
            <div className="space-y-4">
              {pokemon.evolutionPaths.map((path, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-900/50 rounded-md grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                >
                  <InputWithLabel
                    label="Evolves To (Species ID)"
                    id={`evoTo-${index}`}
                    type="number"
                    value={path.toSpeciesId}
                    onChange={(e) => handleEvolutionPathChange(index, "toSpeciesId", e.target.value)}
                  />
                  <InputWithLabel
                    label="Method (e.g., level-up)"
                    id={`evoMethod-${index}`}
                    value={path.method}
                    onChange={(e) => handleEvolutionPathChange(index, "method", e.target.value)}
                  />
                  <InputWithLabel
                    label="Detail (e.g., 16 or 'fire-stone')"
                    id={`evoDetail-${index}`}
                    value={path.detail}
                    onChange={(e) => handleEvolutionPathChange(index, "detail", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeEvolutionPath(index)}
                    className="p-2 bg-red-800 hover:bg-red-700 rounded h-12"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addEvolutionPath} className="mt-4 text-teal-400 flex items-center gap-2">
              <PlusCircle size={16} /> Add Evolution Path
            </button>
          </div>

          {/* --- Change Log Section --- */}
          <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Change History</h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto text-sm">
              {changeLogs.map((log) => (
                <li key={log._id} className="p-2 bg-gray-900/50 rounded-md flex justify-between">
                  <span className="text-text-secondary">{log.changeDescription}</span>
                  <span className="text-text-tertiary">
                    {new Date(log.createdAt).toLocaleString()} by {log.adminUser.email}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end">
            <StyledButton type="submit" loading={loading}>
              Save All Changes
            </StyledButton>
          </div>
        </form>
      )}
    </div>
  );
};

export default PokemonEditorPage;
