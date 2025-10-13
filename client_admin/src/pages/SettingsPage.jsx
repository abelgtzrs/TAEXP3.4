import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { listPersonas, updatePersona } from "../services/personaService";
import PageHeader from "../components/ui/PageHeader";
import Widget from "../components/ui/Widget";

const ColorInput = ({ label, value, onChange }) => (
  <label className="flex items-center gap-2 text-xs">
    <span className="w-24 text-text-secondary">{label}</span>
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-10 p-0 border border-gray-600 rounded bg-transparent"
    />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs"
      placeholder="#FFFFFF"
    />
  </label>
);

const PersonaPreview = ({ persona }) => {
  if (!persona) return null;
  const style = {
    fontFamily: persona.font,
    background: persona.colors.bg,
    color: persona.text.main,
    borderColor: persona.colors.primary,
  };
  return (
    <div className="rounded-lg border p-4" style={style}>
      <h3 className="text-lg font-bold mb-1" style={{ color: persona.colors.primary }}>
        {persona.name} Preview
      </h3>
      <p className="text-sm" style={{ color: persona.text.secondary }}>
        Secondary text sample using your palette.
      </p>
      <div className="mt-3 flex gap-2 text-xs">
        <span className="px-2 py-1 rounded" style={{ background: persona.colors.surface }}>
          Surface chip
        </span>
        <span className="px-2 py-1 rounded" style={{ background: persona.colors.secondary }}>
          Secondary chip
        </span>
        <span className="px-2 py-1 rounded" style={{ background: persona.colors.tertiary, color: "#111" }}>
          Tertiary chip
        </span>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const [personas, setPersonas] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [fontChoice, setFontChoice] = useState("");

  // Common font stacks; if your deployment includes additional fonts via CSS imports,
  // add them here as label/value pairs.
  const FONT_OPTIONS = [
    { label: "Inter (default)", value: "Inter, sans-serif" },
    { label: "System UI", value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" },
    { label: "Roboto", value: "Roboto, 'Helvetica Neue', Arial, sans-serif" },
    { label: "Open Sans", value: "'Open Sans', 'Helvetica Neue', Arial, sans-serif" },
    { label: "Lato", value: "Lato, 'Helvetica Neue', Arial, sans-serif" },
    { label: "Poppins", value: "Poppins, 'Helvetica Neue', Arial, sans-serif" },
    { label: "Montserrat", value: "Montserrat, 'Helvetica Neue', Arial, sans-serif" },
    { label: "Nunito", value: "Nunito, 'Helvetica Neue', Arial, sans-serif" },
    { label: "Source Sans 3", value: "'Source Sans 3', 'Helvetica Neue', Arial, sans-serif" },
    { label: "Merriweather (serif)", value: "Merriweather, Georgia, 'Times New Roman', serif" },
    { label: "Playfair Display (serif)", value: "'Playfair Display', Georgia, 'Times New Roman', serif" },
    { label: "Fira Code (mono)", value: "'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" },
    { label: "JetBrains Mono (mono)", value: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" },
  ];

  const activePersonaId = user?.activeAbelPersona?._id || null;
  const unlockedIds = new Set((user?.unlockedAbelPersonas || []).map((p) => p._id));

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await listPersonas();
        if (mounted) setPersonas(list);
      } catch (e) {
        console.error("Failed to load personas", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const selected = useMemo(() => personas.find((p) => p._id === selectedId) || null, [personas, selectedId]);

  useEffect(() => {
    if (selected) setEditing(JSON.parse(JSON.stringify(selected)));
    else setEditing(null);
  }, [selected]);

  // Keep the dropdown selection in sync with the editing font value
  useEffect(() => {
    if (!editing) return;
    const match = FONT_OPTIONS.find((f) => f.value === editing.font);
    setFontChoice(match ? match.value : "custom");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing?.font]);

  const handleSelectActive = async (personaId) => {
    if (personaId === activePersonaId) return;
    try {
      const response = await api.put("/users/me/profile/active-persona", { personaId });
      setUser(response.data.data);
    } catch (error) {
      console.error("Failed to set active persona:", error);
      alert("Could not set active persona.");
    }
  };

  const handleSave = async () => {
    if (!editing?._id) return;
    try {
      const payload = {
        name: editing.name,
        description: editing.description,
        font: editing.font,
        colors: editing.colors,
        text: editing.text,
      };
      const updated = await updatePersona(editing._id, payload);
      setPersonas((arr) => arr.map((p) => (p._id === updated._id ? updated : p)));
      // If we edited the currently active persona, refresh user to apply theme
      if (activePersonaId === updated._id) {
        const me = await api.get("/users/me");
        setUser(me.data.data);
      }
    } catch (e) {
      console.error("Failed to update persona", e);
      alert("Failed to update persona");
    }
  };

  return (
    <div>
      <PageHeader title="Persona Manager" subtitle="Edit persona palettes, fonts, and preview them live." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Persona list and active selection */}
        <Widget title="Personas" className="lg:col-span-1">
          <div className="space-y-2">
            <button
              onClick={() => handleSelectActive(null)}
              className={`w-full text-left p-3 rounded border ${
                !activePersonaId ? "border-primary" : "border-gray-700 hover:border-gray-500"
              }`}
            >
              <div className="font-semibold">Standard Issue</div>
              <div className="text-xs text-text-secondary">Default system theme</div>
            </button>
            <div className="h-[1px] bg-gray-700 my-2" />
            {personas.map((p) => (
              <div key={p._id} className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedId(p._id)}
                  className={`flex-1 text-left p-3 rounded border ${
                    selectedId === p._id ? "border-primary" : "border-gray-700 hover:border-gray-500"
                  }`}
                  style={{ borderColor: selectedId === p._id ? p.colors.primary : undefined }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-xs text-text-secondary">{p.description}</div>
                    </div>
                    <div className="flex gap-1">
                      {[p.colors.primary, p.colors.secondary, p.colors.tertiary].map((c, i) => (
                        <span
                          key={i}
                          className="w-4 h-4 rounded-full border border-gray-600"
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleSelectActive(p._id)}
                  className={`px-2 py-1 text-xs rounded border ${
                    activePersonaId === p._id ? "border-primary text-primary" : "border-gray-600 text-gray-300"
                  }`}
                  title="Set active"
                >
                  Set Active
                </button>
              </div>
            ))}
          </div>
        </Widget>

        {/* Middle: Editor */}
        <Widget title="Editor" className="lg:col-span-1">
          {!editing ? (
            <div className="text-sm text-text-secondary">Select a persona from the left to edit.</div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs">
                  Name
                  <input
                    type="text"
                    className="mt-1 w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  />
                </label>
                <label className="text-xs">
                  Font
                  <select
                    className="mt-1 w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                    value={fontChoice}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFontChoice(val);
                      if (val !== "custom") {
                        setEditing({ ...editing, font: val });
                      }
                    }}
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                    <option value="custom">Custom…</option>
                  </select>
                  {fontChoice === "custom" && (
                    <input
                      type="text"
                      className="mt-2 w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      value={editing.font}
                      onChange={(e) => setEditing({ ...editing, font: e.target.value })}
                      placeholder="e.g. Inter, sans-serif"
                    />
                  )}
                </label>
              </div>
              <label className="text-xs block">
                Description
                <textarea
                  className="mt-1 w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={2}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="font-semibold text-white text-sm">Colors</div>
                  <ColorInput
                    label="Background"
                    value={editing.colors.bg}
                    onChange={(v) => setEditing({ ...editing, colors: { ...editing.colors, bg: v } })}
                  />
                  <ColorInput
                    label="Surface"
                    value={editing.colors.surface}
                    onChange={(v) => setEditing({ ...editing, colors: { ...editing.colors, surface: v } })}
                  />
                  <ColorInput
                    label="Primary"
                    value={editing.colors.primary}
                    onChange={(v) => setEditing({ ...editing, colors: { ...editing.colors, primary: v } })}
                  />
                  <ColorInput
                    label="Secondary"
                    value={editing.colors.secondary}
                    onChange={(v) => setEditing({ ...editing, colors: { ...editing.colors, secondary: v } })}
                  />
                  <ColorInput
                    label="Tertiary"
                    value={editing.colors.tertiary}
                    onChange={(v) => setEditing({ ...editing, colors: { ...editing.colors, tertiary: v } })}
                  />
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-white text-sm">Text</div>
                  <ColorInput
                    label="Main"
                    value={editing.text.main}
                    onChange={(v) => setEditing({ ...editing, text: { ...editing.text, main: v } })}
                  />
                  <ColorInput
                    label="Secondary"
                    value={editing.text.secondary}
                    onChange={(v) => setEditing({ ...editing, text: { ...editing.text, secondary: v } })}
                  />
                  <ColorInput
                    label="Tertiary"
                    value={editing.text.tertiary}
                    onChange={(v) => setEditing({ ...editing, text: { ...editing.text, tertiary: v } })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 rounded bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary text-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </Widget>

        {/* Right: Live preview */}
        <Widget title="Preview" className="lg:col-span-1">
          {editing ? (
            <PersonaPreview persona={editing} />
          ) : (
            <div className="text-sm text-text-secondary">No persona selected.</div>
          )}
        </Widget>
      </div>
    </div>
  );
};

export default SettingsPage;
