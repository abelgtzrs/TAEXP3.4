// src/pages/AdminBadgeCollectionsPage.jsx
import { useEffect, useMemo, useState } from "react";
import Widget from "../components/ui/Widget";
import StyledButton from "../components/ui/StyledButton";
import StyledInput from "../components/ui/StyledInput";
import PageHeader from "../components/ui/PageHeader";
import api from "../services/api";

const toFormData = (obj) => {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, v);
  });
  return fd;
};

export default function AdminBadgeCollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [creatingCollection, setCreatingCollection] = useState(false);
  const [collectionForm, setCollectionForm] = useState({
    key: "",
    name: "",
    description: "",
    generation: 1,
    totalItems: 8,
    order: 0,
    legendaryGateNeeded: false,
  });

  const selectedCollection = useMemo(
    () => collections.find((c) => c.key === selectedKey) || null,
    [collections, selectedKey]
  );

  const fetchCollections = async () => {
    try {
      const res = await api.get("/admin/badge-collections/collections");
      setCollections(res.data.data || []);
      if (!selectedKey && res.data.data?.length) setSelectedKey(res.data.data[0].key);
    } catch (e) {
      setError("Failed to load collections");
    }
  };

  const fetchBadges = async (key) => {
    if (!key) return;
    setLoading(true);
    try {
      const res = await api.get(`/admin/badge-collections/collections/${key}`);
      setBadges(res.data.data || []);
    } catch (e) {
      setError("Failed to load badges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    fetchBadges(selectedKey);
  }, [selectedKey]);

  const [form, setForm] = useState({
    badgeId: "",
    name: "",
    description: "",
    category: "",
    series: "",
    unlocksGeneration: "",
    unlockDay: 5,
    orderInCategory: 1,
    legendaryGate: false,
    collectionKey: "",
    small: null,
    large: null,
  });

  useEffect(() => {
    setForm((f) => ({ ...f, collectionKey: selectedKey || "" }));
  }, [selectedKey]);

  const createBadge = async () => {
    setSaving(true);
    try {
      const fd = toFormData(form);
      const res = await api.post("/admin/badge-collections/badges", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const nextOrder = (badges?.length || 0) + 1;
      setBadges((b) => [...b, res.data.data]);
      setForm((f) => ({
        ...f,
        badgeId: "",
        name: "",
        description: "",
        series: "",
        unlockDay: 5,
        orderInCategory: nextOrder,
        small: null,
        large: null,
      }));
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create badge");
    } finally {
      setSaving(false);
    }
  };

  const createCollection = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = { ...collectionForm };
      const res = await api.post("/admin/badge-collections/collections", payload);
      const newCol = res.data?.data;
      setCollections((prev) => {
        const next = [...prev, newCol].sort((a, b) => (a.order || 0) - (b.order || 0) || a.key.localeCompare(b.key));
        return next;
      });
      setSelectedKey(newCol.key);
      setCreatingCollection(false);
      setCollectionForm({ key: "", name: "", description: "", generation: 1, totalItems: 8, order: 0, legendaryGateNeeded: false });
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create collection");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Badge Collections" subtitle="Create collections, badges, and define unlock rules" />
      {error && <p className="text-status-danger mt-2">{error}</p>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Widget title="Collections" className="lg:col-span-1">
          <div className="space-y-2">
            {collections.map((c) => (
              <button
                key={c.key}
                onClick={() => setSelectedKey(c.key)}
                className={`w-full text-left px-3 py-2 rounded border ${
                  selectedKey === c.key ? "border-primary text-white" : "border-gray-700 text-text-secondary"
                }`}
              >
                <div className="text-sm font-medium">{c.name || c.key}</div>
                <div className="text-[11px] text-text-tertiary">
                  Gen {c.generation} • Items {c.totalItems}
                </div>
              </button>
            ))}
            <div className="pt-2 border-t border-gray-800 mt-2">
              <StyledButton onClick={() => setCreatingCollection((v) => !v)} className="w-full">
                {creatingCollection ? "Cancel" : "New Collection"}
              </StyledButton>
              {creatingCollection && (
                <div className="mt-2 space-y-2">
                  <div>
                    <label className="block text-[11px] text-text-tertiary">Key (unique)</label>
                    <StyledInput
                      value={collectionForm.key}
                      onChange={(e) => setCollectionForm({ ...collectionForm, key: e.target.value })}
                      placeholder="e.g. gen1"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-text-tertiary">Name</label>
                    <StyledInput
                      value={collectionForm.name}
                      onChange={(e) => setCollectionForm({ ...collectionForm, name: e.target.value })}
                      placeholder="Kanto Gym Badges"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-text-tertiary">Description</label>
                    <StyledInput
                      value={collectionForm.description}
                      onChange={(e) => setCollectionForm({ ...collectionForm, description: e.target.value })}
                      placeholder="Optional description"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-text-tertiary">Generation</label>
                    <StyledInput
                      type="number"
                      min={1}
                      value={collectionForm.generation}
                      onChange={(e) => setCollectionForm({ ...collectionForm, generation: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-text-tertiary">Total Items in Collection</label>
                    <StyledInput
                      type="number"
                      min={1}
                      value={collectionForm.totalItems}
                      onChange={(e) => setCollectionForm({ ...collectionForm, totalItems: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-text-tertiary">Order (optional)</label>
                    <StyledInput
                      type="number"
                      value={collectionForm.order}
                      onChange={(e) => setCollectionForm({ ...collectionForm, order: Number(e.target.value) })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="legendaryGateNeeded"
                      type="checkbox"
                      checked={collectionForm.legendaryGateNeeded}
                      onChange={(e) => setCollectionForm({ ...collectionForm, legendaryGateNeeded: e.target.checked })}
                    />
                    <label htmlFor="legendaryGateNeeded" className="text-[13px] text-text-secondary">
                      Completing this collection unlocks legendaries for its generation
                    </label>
                  </div>
                  <StyledButton
                    onClick={createCollection}
                    disabled={saving || !collectionForm.key || !collectionForm.name || !collectionForm.generation || !collectionForm.totalItems}
                    className="bg-status-success w-full"
                  >
                    {saving ? "Saving..." : "Create Collection"}
                  </StyledButton>
                </div>
              )}
            </div>
          </div>
        </Widget>
        <Widget title="Badges in Collection" className="lg:col-span-2">
          <div className="space-y-6">
            {!selectedCollection ? (
              <div className="text-text-tertiary">
                <p>Select a collection on the left or create a new one to begin adding badges.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
              {loading ? (
                <p className="text-text-tertiary">Loading…</p>
              ) : badges.length === 0 ? (
                <p className="text-text-tertiary">No badges yet.</p>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="text-text-tertiary">
                    <tr>
                      <th className="text-left py-2 pr-4">Order</th>
                      <th className="text-left py-2 pr-4">ID</th>
                      <th className="text-left py-2 pr-4">Name</th>
                      <th className="text-left py-2 pr-4">Unlock Day</th>
                      <th className="text-left py-2 pr-4">Gen</th>
                      <th className="text-left py-2 pr-4">Legendary Gate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {badges
                      .slice()
                      .sort((a, b) => (a.orderInCategory || 0) - (b.orderInCategory || 0))
                      .map((b) => (
                        <tr key={b._id} className="border-t border-gray-800">
                          <td className="py-2 pr-4">{b.orderInCategory}</td>
                          <td className="py-2 pr-4">{b.badgeId}</td>
                          <td className="py-2 pr-4">{b.name}</td>
                          <td className="py-2 pr-4">{b.unlockDay}</td>
                          <td className="py-2 pr-4">{b.unlocksGeneration || "—"}</td>
                          <td className="py-2 pr-4">{b.legendaryGate ? "Yes" : "No"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
            )}
            {selectedCollection && (
            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-sm uppercase text-text-tertiary mb-2">Create New Badge</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-text-tertiary">Collection</label>
                  <div className="px-3 py-2 rounded border border-gray-700 text-text-secondary">
                    {selectedCollection.name || selectedCollection.key} ({selectedCollection.key})
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-text-tertiary">Badge ID (unique)</label>
                  <StyledInput value={form.badgeId} onChange={(e) => setForm({ ...form, badgeId: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] text-text-tertiary">Name</label>
                  <StyledInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] text-text-tertiary">Description</label>
                  <StyledInput
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-text-tertiary">Category (display group)</label>
                  <StyledInput value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] text-text-tertiary">Series</label>
                  <StyledInput value={form.series} onChange={(e) => setForm({ ...form, series: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] text-text-tertiary">Unlocks Generation</label>
                  <StyledInput
                    type="number"
                    value={form.unlocksGeneration}
                    onChange={(e) => setForm({ ...form, unlocksGeneration: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-text-tertiary">Unlock Day (multiple of 5)</label>
                  <StyledInput
                    type="number"
                    value={form.unlockDay}
                    onChange={(e) => setForm({ ...form, unlockDay: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-text-tertiary">Order</label>
                  <StyledInput
                    type="number"
                    value={form.orderInCategory}
                    onChange={(e) => setForm({ ...form, orderInCategory: Number(e.target.value) })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="legendaryGate"
                    type="checkbox"
                    checked={form.legendaryGate}
                    onChange={(e) => setForm({ ...form, legendaryGate: e.target.checked })}
                  />
                  <label htmlFor="legendaryGate" className="text-[13px] text-text-secondary">
                    Completing collection unlocks legendaries for this generation
                  </label>
                </div>
                <div>
                  <label className="block text-[11px] text-text-tertiary">Small Sprite</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, small: e.target.files?.[0] || null })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-text-tertiary">Large Sprite</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, large: e.target.files?.[0] || null })}
                  />
                </div>
              </div>
              <div className="mt-3">
                <StyledButton
                  onClick={createBadge}
                  disabled={saving || !form.collectionKey || !form.badgeId}
                  className="bg-status-success"
                >
                  {saving ? "Saving..." : "Create Badge"}
                </StyledButton>
              </div>
            </div>
            )}
          </div>
        </Widget>
      </div>
    </div>
  );
}
