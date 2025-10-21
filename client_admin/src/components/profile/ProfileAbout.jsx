import { useState } from "react";
import Widget from "../ui/Widget";
import StyledButton from "../ui/StyledButton";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ProfileAbout = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
    pronouns: user?.pronouns || "",
    occupation: user?.occupation || "",
    birthday: user?.birthday ? new Date(user.birthday).toISOString().slice(0, 10) : "",
    interests: (user?.interests || []).join(", "),
    socials: {
      twitter: user?.socials?.twitter || "",
      instagram: user?.socials?.instagram || "",
      github: user?.socials?.github || "",
      linkedin: user?.socials?.linkedin || "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socials.")) {
      const key = name.split(".")[1];
      setForm((f) => ({ ...f, socials: { ...f.socials, [key]: value } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const save = async () => {
    const payload = {
      ...form,
      interests: form.interests
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      const res = await api.put("/users/me/profile/details", payload);
      setUser(res.data.data);
    } catch (e) {
      console.error("Failed to save profile details", e);
      alert("Could not save profile details.");
    }
  };

  return (
    <Widget title="About Me">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-text-secondary mb-1">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full rounded-md bg-black/30 border border-white/10 p-2 min-h-[90px]"
            placeholder="Tell the world about yourself"
          />
        </div>
        <div>
          <label className="block text-text-secondary mb-1">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full rounded-md bg-black/30 border border-white/10 p-2"
            placeholder="City, Country"
          />
          <label className="block text-text-secondary mb-1 mt-2">Website</label>
          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            className="w-full rounded-md bg-black/30 border border-white/10 p-2"
            placeholder="https://example.com"
          />
          <label className="block text-text-secondary mb-1 mt-2">Pronouns</label>
          <input
            name="pronouns"
            value={form.pronouns}
            onChange={handleChange}
            className="w-full rounded-md bg-black/30 border border-white/10 p-2"
            placeholder="she/her, he/him, they/them"
          />
          <label className="block text-text-secondary mb-1 mt-2">Occupation</label>
          <input
            name="occupation"
            value={form.occupation}
            onChange={handleChange}
            className="w-full rounded-md bg-black/30 border border-white/10 p-2"
            placeholder="What do you do?"
          />
          <label className="block text-text-secondary mb-1 mt-2">Birthday</label>
          <input
            type="date"
            name="birthday"
            value={form.birthday}
            onChange={handleChange}
            className="w-full rounded-md bg-black/30 border border-white/10 p-2"
          />
        </div>
        <div>
          <label className="block text-text-secondary mb-1">Interests (comma-separated)</label>
          <input
            name="interests"
            value={form.interests}
            onChange={handleChange}
            className="w-full rounded-md bg-black/30 border border-white/10 p-2"
            placeholder="gaming, art, coding"
          />
        </div>
        <div>
          <label className="block text-text-secondary mb-1">Socials</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              name="socials.twitter"
              value={form.socials.twitter}
              onChange={handleChange}
              className="rounded-md bg-black/30 border border-white/10 p-2"
              placeholder="Twitter URL or @handle"
            />
            <input
              name="socials.instagram"
              value={form.socials.instagram}
              onChange={handleChange}
              className="rounded-md bg-black/30 border border-white/10 p-2"
              placeholder="Instagram URL or @handle"
            />
            <input
              name="socials.github"
              value={form.socials.github}
              onChange={handleChange}
              className="rounded-md bg-black/30 border border-white/10 p-2"
              placeholder="GitHub URL"
            />
            <input
              name="socials.linkedin"
              value={form.socials.linkedin}
              onChange={handleChange}
              className="rounded-md bg-black/30 border border-white/10 p-2"
              placeholder="LinkedIn URL"
            />
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <StyledButton onClick={save}>Save Details</StyledButton>
      </div>
    </Widget>
  );
};

export default ProfileAbout;
