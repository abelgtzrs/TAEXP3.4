import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { listPersonas, updatePersona } from "../../services/personaService";
import Widget from "../ui/Widget";

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

const PersonaEditor = ({ className = "" }) => {
  const { user, setUser } = useAuth();
  const [personas, setPersonas] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [fontChoice, setFontChoice] = useState("");
  const [showOwnedOnly, setShowOwnedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const DEFAULT_THEME = {
    _id: "__standard__",
    name: "Standard Issue",
    description: "Default system theme",
    colors: {
      bg: "#0D1117",
      surface: "#161B22",
      primary: "#1a6359ff",
      secondary: "#0099c399",
      tertiary: "#A5F3FC",
    },
    text: {
      main: "#E5E7EB",
      secondary: "#9CA3AF",
      tertiary: "#4B5563",
    },
    font: "Inter, sans-serif",
  };

  const FONT_OPTIONS = [
    { label: "Inter (default)", value: "Inter, sans-serif" },
    {
      label: "System UI",
      value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },
    { label: "Roboto", value: "Roboto, 'Helvetica Neue', Arial, sans-serif" },
    { label: "Open Sans", value: "'Open Sans', 'Helvetica Neue', Arial, sans-serif" },
    { label: "Lato", value: "Lato, 'Helvetica Neue', Arial, sans-serif" },
    { label: "Poppins", value: "Poppins, 'Helvetica Neue', Arial, sans-serif" },
    { label: "Montserrat", value: "Montserrat, 'Helvetica Neue', Arial, sans-serif" },
    { label: "Nunito", value: "Nunito, 'Helvetica Neue', Arial, sans-serif" },
    { label: "Source Sans 3", value: "'Source Sans 3', 'Helvetica Neue', Arial, sans-serif" },
    { label: "Merriweather (serif)", value: "Merriweather, Georgia, 'Times New Roman', serif" },
    { label: "Playfair Display (serif)", value: "'Playfair Display', Georgia, 'Times New Roman', serif" },
    {
      label: "Fira Code (mono)",
      value:
        "'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
    {
      label: "JetBrains Mono (mono)",
      value:
        "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
  ];

  const activePersonaId = user?.activeAbelPersona?._id || null;
  const unlockedIds = new Set((user?.unlockedAbelPersonas || []).map((p) => p._id));
  const ownedCount = (user?.unlockedAbelPersonas || []).length;

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

  const selected = useMemo(() => {
    if (selectedId === "__standard__") return DEFAULT_THEME;
    return personas.find((p) => p._id === selectedId) || null;
  }, [personas, selectedId]);
  const filteredPersonas = useMemo(
    () => (showOwnedOnly ? personas.filter((p) => unlockedIds.has(p._id)) : personas),
    [showOwnedOnly, personas, unlockedIds]
  );
  const totalPages = Math.max(1, Math.ceil(filteredPersonas.length / ITEMS_PER_PAGE));
  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filteredPersonas.slice(pageStart, pageStart + ITEMS_PER_PAGE);

  useEffect(() => {
    if (selected) setEditing(JSON.parse(JSON.stringify(selected)));
    else setEditing(null);
  }, [selected]);

  // Live apply theme to the app when editing the active persona (or Standard Issue when active is none)
  useEffect(() => {
    if (!editing) return;
    const isEditingActive =
      (editing._id && editing._id !== "__standard__" && editing._id === (user?.activeAbelPersona?._id || null)) ||
      (editing._id === "__standard__" && !user?.activeAbelPersona);
    if (!isEditingActive) return;

    const root = window.document.documentElement;
    const theme = { colors: editing.colors, text: editing.text, font: editing.font };
    if (theme.colors) {
      root.style.setProperty("--color-bg", theme.colors.bg);
      root.style.setProperty("--color-surface", theme.colors.surface);
      root.style.setProperty("--color-primary", theme.colors.primary);
      root.style.setProperty("--color-secondary", theme.colors.secondary);
      root.style.setProperty("--color-tertiary", theme.colors.tertiary);
    }
    if (theme.text) {
      root.style.setProperty("--color-text-main", theme.text.main);
      root.style.setProperty("--color-text-secondary", theme.text.secondary);
      root.style.setProperty("--color-text-tertiary", theme.text.tertiary);
    }
    if (theme.font) {
      root.style.setProperty("--font-main", theme.font);
    }
  }, [editing, user?.activeAbelPersona]);

  useEffect(() => {
    setCurrentPage(1);
  }, [showOwnedOnly]);
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredPersonas.length, totalPages]);

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
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Widget title="Personas" className="lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-text-secondary">
              Owned {ownedCount} / {personas.length}
            </div>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={showOwnedOnly} onChange={(e) => setShowOwnedOnly(e.target.checked)} />
              <span>Owned only</span>
            </label>
          </div>
          <div className="space-y-1 overflow-hidden">
            {/* Standard Issue row */}
            <div className="flex items-center gap-2 flex-nowrap">
              <button
                onClick={() => setSelectedId("__standard__")}
                className={`flex-1 text-left p-2 rounded border overflow-hidden ${
                  selectedId === "__standard__" ? "border-primary" : "border-gray-700 hover:border-gray-500"
                }`}
                style={{ borderColor: selectedId === "__standard__" ? DEFAULT_THEME.colors.primary : undefined }}
              >
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="min-w-0">
                    <div className="font-semibold text-white text-sm truncate">Standard Issue</div>
                    <div className="text-[11px] text-text-secondary truncate">Default system theme</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {[
                      DEFAULT_THEME.colors.bg,
                      DEFAULT_THEME.colors.surface,
                      DEFAULT_THEME.colors.primary,
                      DEFAULT_THEME.colors.secondary,
                      DEFAULT_THEME.colors.tertiary,
                    ].map((c, i) => (
                      <span key={i} className="w-3.5 h-3.5 rounded border border-gray-600" style={{ background: c }} />
                    ))}
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="px-1.5 py-0.5 text-[10px] rounded border border-gray-600 text-gray-300">
                    Default
                  </span>
                </div>
              </button>
              <button
                onClick={() => handleSelectActive(null)}
                className={`px-2 py-1 text-[11px] rounded border shrink-0 whitespace-nowrap ${
                  !activePersonaId ? "border-primary text-primary" : "border-gray-600 text-gray-300"
                }`}
                title="Set active"
              >
                Set Active
              </button>
            </div>
            <div className="h-[1px] bg-gray-700 my-2" />
            {pageItems.map((p) => (
              <div key={p._id} className="flex items-center gap-2 flex-nowrap">
                <button
                  onClick={() => setSelectedId(p._id)}
                  className={`flex-1 text-left p-2 rounded border overflow-hidden ${
                    selectedId === p._id ? "border-primary" : "border-gray-700 hover:border-gray-500"
                  }`}
                  style={{ borderColor: selectedId === p._id ? p.colors.primary : undefined }}
                >
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <div className="min-w-0">
                      <div className="font-semibold text-white text-sm truncate">{p.name}</div>
                      <div className="text-[11px] text-text-secondary truncate">{p.description}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {[p.colors.bg, p.colors.surface, p.colors.primary, p.colors.secondary, p.colors.tertiary].map(
                        (c, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded border border-gray-600"
                            style={{ background: c }}
                          />
                        )
                      )}
                    </div>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span
                      className={`px-1.5 py-0.5 text-[10px] rounded border ${
                        unlockedIds.has(p._id) ? "border-green-600 text-green-300" : "border-gray-600 text-gray-400"
                      }`}
                    >
                      {unlockedIds.has(p._id) ? "Owned" : "Locked"}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => handleSelectActive(p._id)}
                  disabled={!unlockedIds.has(p._id)}
                  className={`px-2 py-1 text-[11px] rounded border shrink-0 whitespace-nowrap ${
                    !unlockedIds.has(p._id)
                      ? "border-gray-700 text-gray-500 cursor-not-allowed"
                      : activePersonaId === p._id
                      ? "border-primary text-primary"
                      : "border-gray-600 text-gray-300"
                  }`}
                  title="Set active"
                >
                  Set Active
                </button>
              </div>
            ))}
            {/* Pagination */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                className={`px-2 py-1 rounded border ${
                  currentPage === 1
                    ? "border-gray-700 text-gray-500 cursor-not-allowed"
                    : "border-gray-600 text-gray-300 hover:border-gray-500"
                }`}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <div className="flex items-center gap-2">
                <span>
                  Page {Math.min(currentPage, totalPages)} / {totalPages}
                </span>
              </div>
              <button
                className={`px-2 py-1 rounded border ${
                  currentPage === totalPages
                    ? "border-gray-700 text-gray-500 cursor-not-allowed"
                    : "border-gray-600 text-gray-300 hover:border-gray-500"
                }`}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </Widget>

        {/* Editor */}
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

              <div className="space-y-3">
                <div>
                  <div className="font-semibold text-white text-sm mb-2">Colors</div>
                  <div className="space-y-2">
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
                </div>
                <div>
                  <div className="font-semibold text-white text-sm mb-2">Text</div>
                  <div className="space-y-2">
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
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={editing?._id === "__standard__"}
                  className={`px-3 py-1.5 rounded border text-sm ${
                    editing?._id === "__standard__"
                      ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-primary/20 hover:bg-primary/30 border-primary/40 text-primary"
                  }`}
                  title={
                    editing?._id === "__standard__" ? "Standard Issue applies live; no save needed" : "Save to database"
                  }
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </Widget>

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

export default PersonaEditor;
