import { useRef, useState } from "react";
import { Image as ImageIcon, UploadCloud } from "lucide-react";
import api from "../../services/api";

export default function ImageUploader({
  label = "Upload Image",
  onUploaded,
  uploadPath = "/admin/snoopys/upload-image",
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = () => inputRef.current?.click();

  const onChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post(uploadPath, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!data?.success) throw new Error(data?.message || "Upload failed");
      onUploaded?.(data.url);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = ""; // reset file input
    }
  };

  return (
    <div>
      <div className="inline-flex items-center gap-2">
        <button
          type="button"
          onClick={handleClick}
          className="px-3 py-2 rounded border border-primary bg-background text-text-main hover:opacity-90 inline-flex items-center gap-2"
        >
          <UploadCloud size={16} /> {uploading ? "Uploading..." : label}
        </button>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
      <input type="file" ref={inputRef} onChange={onChange} accept="image/*" className="hidden" />
    </div>
  );
}
