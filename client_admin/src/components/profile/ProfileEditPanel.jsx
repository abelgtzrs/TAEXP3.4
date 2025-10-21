import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import StyledButton from "../ui/StyledButton";

export default function ProfileEditPanel() {
  const { user, setUser } = useAuth();
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [motto, setMotto] = useState(user?.motto || "");
  const [saving, setSaving] = useState(false);
  const [localFit, setLocalFit] = useState(user?.bannerFitMode || "cover");
  const [posX, setPosX] = useState(user?.bannerPositionX ?? 50);
  const [posY, setPosY] = useState(user?.bannerPositionY ?? 50);
  const [uploading, setUploading] = useState(false);
  const bannerInputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setLocalFit(user?.bannerFitMode || "cover");
    setPosX(user?.bannerPositionX ?? 50);
    setPosY(user?.bannerPositionY ?? 50);
  }, [user]);

  const serverBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").split("/api")[0];
  const bannerUrl = user?.bannerImage ? `${serverBaseUrl}${user.bannerImage}` : null;
  const avatarUrl = user?.profilePicture
    ? `${serverBaseUrl}${user.profilePicture}`
    : `https://api.dicebear.com/8.x/pixel-art/svg?seed=${user?.username || "user"}`;

  const pushBannerSettings = async (updates) => {
    try {
      const { data } = await api.put("/users/me/profile/banner-settings", updates);
      setUser(data.data);
    } catch (err) {
      console.error("Failed to update banner settings:", err);
    }
  };

  const debouncedPush = (updates) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushBannerSettings(updates), 250);
  };

  const onChangeFit = (val) => {
    setLocalFit(val);
    pushBannerSettings({ bannerFitMode: val });
  };

  const onChangePosX = (val) => {
    setPosX(val);
    debouncedPush({ bannerPositionX: val });
  };

  const onChangePosY = (val) => {
    setPosY(val);
    debouncedPush({ bannerPositionY: val });
  };

  const handleBannerSelect = () => bannerInputRef.current?.click();

  const handleBannerChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profileBanner", file);
    try {
      setUploading(true);
      const { data } = await api.put("/users/me/profile-banner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(data.data);
    } catch (err) {
      console.error("Error uploading banner:", err);
      alert("Failed to upload banner image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const { data } = await api.put("/users/me/profile", { bio, location, website, motto });
      setUser(data.data);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const accent = user?.activeAbelPersona?.colors?.primary || "#22d3ee";

  return (
    <div className="px-1 sm:px-2 space-y-4">
      {/* Preview */}
      <div className="relative h-40 sm:h-48 md:h-56 w-full rounded-xl overflow-hidden border border-white/10">
        {bannerUrl && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${bannerUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: localFit,
              backgroundPosition: `${posX}% ${posY}%`,
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${accent}33, transparent), radial-gradient(1200px 400px at 0% 0%, ${accent}22, transparent 60%)`,
            boxShadow: "inset 0 0 80px rgba(255,255,255,0.03)",
          }}
        />
        {/* Avatar overlay to show layering */}
        <div className="absolute bottom-2 left-2 z-10 w-16 h-16 rounded-full border-2 border-white/30 overflow-hidden shadow-lg">
          <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Banner controls */}
      <div className="rounded-lg bg-white/5 border border-white/10 p-3 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-slate-200 font-semibold">Banner Image</div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-md bg-black/40 border border-white/15 hover:bg-black/50 transition text-sm"
              onClick={handleBannerSelect}
              disabled={uploading}
            >
              {uploading ? "Uploading…" : "Upload Banner"}
            </button>
            <select
              className="px-2 py-1.5 rounded-md bg-black/40 border border-white/15 text-sm"
              value={localFit}
              onChange={(e) => onChangeFit(e.target.value)}
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <label className="flex items-center gap-2">
            <span className="w-10">X Pos</span>
            <input
              type="range"
              min="0"
              max="100"
              value={posX}
              onChange={(e) => onChangePosX(Number(e.target.value))}
              className="flex-1 accent-teal-400"
            />
            <span className="w-8 text-right">{posX}%</span>
          </label>
          <label className="flex items-center gap-2">
            <span className="w-10">Y Pos</span>
            <input
              type="range"
              min="0"
              max="100"
              value={posY}
              onChange={(e) => onChangePosY(Number(e.target.value))}
              className="flex-1 accent-teal-400"
            />
            <span className="w-8 text-right">{posY}%</span>
          </label>
        </div>
        <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
      </div>

      {/* General profile fields (optional) */}
      <div className="rounded-lg bg-white/5 border border-white/10 p-3 space-y-3">
        <div className="text-sm text-slate-200 font-semibold">Profile Details</div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            rows={4}
            className="w-full rounded-md bg-black/40 border border-white/15 text-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/40"
            placeholder="Tell us about yourself..."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={100}
              className="w-full rounded-md bg-black/40 border border-white/15 text-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/40"
              placeholder="City, Country"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Motto</label>
            <input
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              maxLength={80}
              className="w-full rounded-md bg-black/40 border border-white/15 text-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/40"
              placeholder="Stay curious. Keep building."
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Website</label>
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            maxLength={200}
            className="w-full rounded-md bg-black/40 border border-white/15 text-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/40"
            placeholder="https://example.com"
          />
        </div>
        <div className="flex justify-end">
          <StyledButton onClick={handleSaveProfile} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </StyledButton>
        </div>
      </div>
    </div>
  );
}
