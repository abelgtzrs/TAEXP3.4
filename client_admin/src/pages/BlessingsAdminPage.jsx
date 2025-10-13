import { useEffect, useMemo, useState } from "react";
import {
  listBlessingDefs,
  createBlessingDef,
  updateBlessingDef,
  deleteBlessingDef,
} from "../services/blessingsService";

const emptyForm = { key: "", name: "", context: "", defaultDescription: "", tags: "", active: true };

export default function BlessingsAdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await listBlessingDefs();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Failed to load blessings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((x) =>
      [x.key, x.name, x.context, x.defaultDescription, (x.tags || []).join(", ")]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q))
    );
  }, [items, search]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        key: form.key.trim(),
        name: form.name.trim(),
        context: form.context || "",
        defaultDescription: form.defaultDescription || "",
        tags: String(form.tags || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        active: !!form.active,
      };
      if (editingId) {
        await updateBlessingDef(editingId, payload);
      } else {
        await createBlessingDef(payload);
      }
      resetForm();
      await fetchAll();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const edit = (item) => {
    setEditingId(item._id);
    setForm({
      key: item.key || "",
      name: item.name || "",
      context: item.context || "",
      defaultDescription: item.defaultDescription || "",
      tags: (item.tags || []).join(", "),
      active: !!item.active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this blessing definition?")) return;
    try {
      await deleteBlessingDef(id);
      await fetchAll();
    } catch (e) {
      setError(e?.message || "Failed to delete");
    }
  };

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold text-white mb-4">Master Blessings</h1>

      {error && <div className="text-red-400 mb-3 text-sm">{error}</div>}

      <form onSubmit={submit} className="p-4 bg-gray-800 rounded border border-gray-700 mb-6">
        <h2 className="text-lg text-white mb-3">{editingId ? "Edit Blessing" : "Create Blessing"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Key (unique)</label>
            <input
              className="w-full p-2 bg-gray-900 rounded border border-gray-600 text-white"
              value={form.key}
              onChange={(e) => setForm({ ...form, key: e.target.value })}
              required={!editingId}
              disabled={!!editingId}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-300 mb-1">Name</label>
            <input
              className="w-full p-2 bg-gray-900 rounded border border-gray-600 text-white"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-300 mb-1">Canonical Context</label>
            <textarea
              className="w-full p-2 bg-gray-900 rounded border border-gray-600 text-white"
              rows={3}
              value={form.context}
              onChange={(e) => setForm({ ...form, context: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-300 mb-1">Default Description</label>
            <textarea
              className="w-full p-2 bg-gray-900 rounded border border-gray-600 text-white"
              rows={2}
              value={form.defaultDescription}
              onChange={(e) => setForm({ ...form, defaultDescription: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-300 mb-1">Tags (comma-separated)</label>
            <input
              className="w-full p-2 bg-gray-900 rounded border border-gray-600 text-white"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2 mt-5">
            <input
              id="active"
              type="checkbox"
              checked={!!form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            <label htmlFor="active" className="text-xs text-gray-300">
              Active
            </label>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="submit"
            className="px-3 py-1.5 text-xs rounded bg-teal-700 hover:bg-teal-600 border border-teal-500 text-white"
            disabled={loading}
          >
            {loading ? "Saving..." : editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              type="button"
              className="px-3 py-1.5 text-xs rounded bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mb-2 flex justify-between items-center">
        <h2 className="text-lg text-white">All Blessings</h2>
        <input
          placeholder="Search..."
          className="w-56 p-2 bg-gray-900 rounded border border-gray-600 text-white text-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-auto rounded border border-gray-700">
        <table className="min-w-full text-left text-xs text-gray-300">
          <thead className="bg-gray-900">
            <tr>
              <th className="p-2">Key</th>
              <th className="p-2">Name</th>
              <th className="p-2">Tags</th>
              <th className="p-2">Active</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it) => (
              <tr key={it._id} className="border-t border-gray-800 hover:bg-gray-800/40">
                <td className="p-2 font-mono text-[11px]">{it.key}</td>
                <td className="p-2">{it.name}</td>
                <td className="p-2 text-gray-400">{(it.tags || []).join(", ")}</td>
                <td className="p-2">{it.active ? "Yes" : "No"}</td>
                <td className="p-2 space-x-2">
                  <button className="text-blue-400 hover:text-blue-300" onClick={() => edit(it)}>
                    Edit
                  </button>
                  <button className="text-red-400 hover:text-red-300" onClick={() => remove(it._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan={5}>
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
