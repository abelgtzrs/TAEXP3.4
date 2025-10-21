import Widget from "../ui/Widget";
import { useAuth } from "../../context/AuthContext";
import { Images, Flame, MapPin, Link as LinkIcon, Star } from "lucide-react";

export default function UserOverviewCard({ onEdit }) {
  const { user } = useAuth();
  if (!user) return null;

  const serverBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").split("/api")[0];
  const avatarUrl = user?.profilePicture
    ? `${serverBaseUrl}${user.profilePicture}`
    : `https://api.dicebear.com/8.x/pixel-art/svg?seed=${user?.username || "user"}`;

  const totalCollectibles =
    (user?.pokemonCollection?.length || 0) +
    (user?.snoopyArtCollection?.length || 0) +
    (user?.habboRares?.length || 0) +
    (user?.yugiohCards?.length || 0);

  const streak = user?.currentLoginStreak || 0;

  return (
    <Widget title="Profile">
      <div className="flex items-start gap-3">
        {/* Small avatar */}
        <div className="w-16 h-16 rounded-full overflow-hidden border border-white/15 shadow">
          <img src={avatarUrl} alt={`${user.username} avatar`} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-white truncate">{user.username}</h3>
            {user?.equippedTitle?.titleBase?.name && (
              <span className="inline-flex items-center gap-1 text-emerald-300 text-xs">
                <Star size={14} /> {user.equippedTitle.titleBase.name}
              </span>
            )}
          </div>
          {user?.motto && (
            <div className="text-xs text-slate-300/90 italic mt-0.5 truncate">“{user.motto}”</div>
          )}
          <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
            <div className="inline-flex items-center gap-1 text-slate-200">
              <Images size={14} /> {totalCollectibles}
            </div>
            <div className="inline-flex items-center gap-1 text-amber-300">
              <Flame size={14} /> {streak}
            </div>
            <div className="inline-flex items-center gap-1 text-sky-300">
              Lv {user.level}
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-300 flex items-center gap-3 flex-wrap">
            {user.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} /> {user.location}
              </span>
            )}
            {user.website && (
              <a
                className="inline-flex items-center gap-1 text-teal-300 hover:text-teal-200 truncate max-w-full"
                href={user.website}
                target="_blank"
                rel="noreferrer"
              >
                <LinkIcon size={14} /> {user.website}
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <button
          onClick={onEdit}
          className="w-full px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm"
        >
          Edit Profile
        </button>
      </div>
    </Widget>
  );
}
