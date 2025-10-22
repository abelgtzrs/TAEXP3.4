import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Save, Edit2, Image as ImageIcon } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { listSnoopys, createSnoopy, updateSnoopy, deleteSnoopy } from "../services/snoopyService";
import ImageUploader from "../components/forms/ImageUploader";

const initialForm = { name: "", imageUrl: "", description: "", rarity: "common" };

const RARITY_OPTIONS = ["common", "uncommon", "rare", "epic", "legendary_snoopy"];

export default function SnoopyAdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  // Server base URL for absolute image paths (works in dev and prod)
  const serverBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").split("/api")[0];

  const buildImageUrl = (url) => {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url; // absolute URL
    // Normalize local paths: Windows backslashes, leading /public, and leading slash
    let path = url
      .replace(/\\/g, "/")
      .replace(/^public\//, "")
      .replace(/^\/public\//, "");
    if (path.startsWith("/")) return `${serverBaseUrl}${path}`;
    return `${serverBaseUrl}/${path}`;
  };

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listSnoopys();
      setItems(data);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load Snoopys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((it) => it.name.toLowerCase().includes(term) || it.snoopyId.toLowerCase().includes(term));
  }, [items, search]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editingId) {
        await updateSnoopy(editingId, form);
      } else {
        await createSnoopy(form);
      }
      resetForm();
      await fetchItems();
    } catch (e) {
      setError(e.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (it) => {
    setEditingId(it._id);
    setForm({ name: it.name, imageUrl: it.imageUrl, description: it.description || "", rarity: it.rarity || "common" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this Snoopy?")) return;
    setLoading(true);
    try {
      await deleteSnoopy(id);
      await fetchItems();
    } catch (e) {
      alert(e.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Snoopy Manager" subtitle="Create, edit and delete Snoopy entries." />

      {/* Create / Edit Form */}
      <form
        onSubmit={onSubmit}
        className="p-4 rounded-lg border mb-6"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-primary)" }}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-background rounded px-3 py-2 border border-primary"
              placeholder="Snoopy name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Image URL</label>
            <input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full bg-background rounded px-3 py-2 border border-primary"
              placeholder="/uploads/snoopys/file.png or https://..."
            />
            <div className="mt-2">
              <ImageUploader label="Upload Image" onUploaded={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
              {form.imageUrl && (
                <div className="mt-2 w-24 h-24 bg-background rounded flex items-center justify-center overflow-hidden border border-primary">
                  <img
                    src={buildImageUrl(form.imageUrl)}
                    alt="preview"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      console.warn("Snoopy preview failed to load", {
                        original: form.imageUrl,
                        resolved: e.currentTarget?.src,
                      });
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-text-secondary mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-background rounded px-3 py-2 border border-primary"
              rows={2}
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Rarity</label>
            <select
              value={form.rarity}
              onChange={(e) => setForm({ ...form, rarity: e.target.value })}
              className="w-full bg-background rounded px-3 py-2 border border-primary"
            >
              {RARITY_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:opacity-90"
            >
              <Save size={16} /> {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="ml-2 px-3 py-2 rounded border border-primary bg-background text-text-main hover:opacity-90"
              >
                Cancel
              </button>
            )}
          </div>
          <div className="md:col-span-2">
            <div className="text-[11px] text-text-secondary">
              Tip: Use the uploader above (recommended) or set a URL. For local files, the server serves{" "}
              <code>/uploads/snoopys/*</code>.
            </div>
          </div>
        </div>
      </form>

      {/* List */}
      <div
        className="rounded-lg border"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-primary)" }}
      >
        <div className="p-3 border-b" style={{ borderColor: "var(--color-primary)" }}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-primary">All Snoopy Entries</h3>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or id..."
              className="bg-background rounded px-2 py-1 text-xs border border-primary"
            />
          </div>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--color-primary)" }}>
          {filtered.map((it) => (
            <div key={it._id} className="p-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-md bg-background flex items-center justify-center overflow-hidden">
                {it.imageUrl ? (
                  <img
                    src={buildImageUrl(it.imageUrl)}
                    alt={it.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <ImageIcon size={20} className="text-text-secondary" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-text-main">{it.name}</div>
                <div className="text-xs text-text-secondary">
                  {it.snoopyId} • {it.rarity}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(it)}
                  className="px-3 py-1 text-xs rounded border border-primary bg-background text-text-main hover:opacity-90 inline-flex items-center gap-1"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => onDelete(it._id)}
                  className="px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-500 text-white inline-flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="p-4 text-center text-sm text-text-secondary">No entries.</div>}
        </div>
      </div>
    </div>
  );
}
