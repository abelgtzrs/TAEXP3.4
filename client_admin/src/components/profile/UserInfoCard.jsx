import { useAuth } from "../../context/AuthContext";
import Widget from "../ui/Widget";
import StyledButton from "../ui/StyledButton";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import api from "../../services/api";

const UserInfoCard = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [motto, setMotto] = useState(user?.motto || "");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  // Construct the base URL for the server to correctly resolve image paths
  const serverBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").split("/api")[0];

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log("Selected file:", file.name, file.size, file.type);

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      console.log("Uploading to:", "/users/me/profile-picture");
      const { data } = await api.put("/users/me/profile-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload response:", data);
      console.log("New profilePicture value:", data.data.profilePicture);
      console.log("Constructed URL will be:", `${serverBaseUrl}${data.data.profilePicture}`);
      setUser(data.data); // Update user context with new data from server
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture. Please try again.");
    }
  };

  const xpPercentage = user.xpToNextLevel > 0 ? (user.experience / user.xpToNextLevel) * 100 : 0;

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
  const { data } = await api.put("/users/me/profile", { bio, location, website, motto });
      setUser(data.data);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Widget title="User Profile" className="flex flex-col items-center text-center h-full">
      <div className="flex flex-col items-center text-center h-full">
        {/* Avatar with Upload Button */}
        <div className="relative group w-60 h-60 mb-4">
          <img
            src={
              user.profilePicture
                ? `${serverBaseUrl}${user.profilePicture}`
                : `https://cdn.artphotolimited.com/images/60229b05bd40b857475a9987/1000x1000/the-strokes.jpg`
            }
            alt="User Avatar"
            className="w-full h-full rounded-full object-cover border-2 border-primary/50 shadow-lg"
          />
          <div
            className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-100 cursor-pointer"
            onClick={handleFileSelect}
          >
            <Camera size={32} className="text-white" />
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
        <h2 className="text-xl font-bold text-white">{user.username}</h2>
        <p className="text-sm font-semibold text-primary mb-4">
          {user.equippedTitle?.titleBase?.name || "Cognitive Framework User"}
        </p>
        {/* XP Bar */}
        <div className="w-full my-4">
          <div className="flex justify-between text-sm font-bold mb-1">
            <span className="text-text-main">Level {user.level}</span>
            <span className="text-text-main">
              {user.experience} / {user.xpToNextLevel} XP
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-3.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${xpPercentage}%` }}></div>
          </div>
        </div>
        {/* Bio / Profile Fields */}
        {!editing ? (
          <div className="w-full text-left mt-3 space-y-2">
            {bio && (
              <div>
                <div className="text-xs text-text-tertiary uppercase tracking-wide font-semibold">Bio</div>
                <p className="text-sm text-text-main whitespace-pre-wrap">{bio}</p>
              </div>
            )}
            {(location || motto) && (
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                {location && <span>📍 {location}</span>}
                {motto && <span>• “{motto}”</span>}
              </div>
            )}
            {website && (
              <div className="text-sm">
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline break-all"
                >
                  {website}
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full text-left mt-3 space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
                rows={4}
                className="w-full rounded-md bg-black/40 border border-white/15 text-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Tell us about yourself..."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-1">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  maxLength={100}
                  className="w-full rounded-md bg-black/40 border border-white/15 text-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-1">Motto</label>
                <input
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  maxLength={80}
                  className="w-full rounded-md bg-black/40 border border-white/15 text-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Stay curious. Keep building."
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-1">Website</label>
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                maxLength={200}
                className="w-full rounded-md bg-black/40 border border-white/15 text-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="https://example.com"
              />
            </div>
          </div>
        )}

        <div className="flex-grow"></div> {/* Spacer */}
        {!editing ? (
          <StyledButton className="w-full mt-4" onClick={() => setEditing(true)}>
            Edit Profile
          </StyledButton>
        ) : (
          <div className="w-full flex gap-2 mt-4">
            <StyledButton className="flex-1" onClick={() => setEditing(false)} variant="secondary">
              Cancel
            </StyledButton>
            <StyledButton className="flex-1" onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </StyledButton>
          </div>
        )}
      </div>
    </Widget>
  );
};

export default UserInfoCard;
