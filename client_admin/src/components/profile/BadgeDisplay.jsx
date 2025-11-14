import { useMemo } from "react";
import Widget from "../ui/Widget";
import api from "../../services/api";

const BadgeDisplay = ({ allBadges = [], earnedBadges = [] }) => {
  const earnedBadgeIds = new Set(earnedBadges.map((b) => b.badgeBase._id));

  // Compute API origin for resolving server-hosted assets
  const API_ORIGIN = useMemo(() => {
    try {
      const u = new URL(api.defaults.baseURL || "");
      return u.origin;
    } catch {
      return "";
    }
  }, []);

  const resolveImage = (badge) => {
    const raw = badge.spriteSmallUrl || badge.spriteLargeUrl || badge.imageUrl || "";
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    // Ensure it starts with a slash
    const path = raw.startsWith("/") ? raw : `/${raw}`;
    return `${API_ORIGIN}${path}`;
  };

  // Optional: sort for a stable layout (by collectionKey then order)
  const flatBadges = useMemo(() => {
    return [...allBadges].sort((a, b) => {
      const ak = a.collectionKey || a.category || "";
      const bk = b.collectionKey || b.category || "";
      if (ak !== bk) return ak.localeCompare(bk);
      const ai = Number(a.orderInCategory || a.index || 0);
      const bi = Number(b.orderInCategory || b.index || 0);
      return ai - bi;
    });
  }, [allBadges]);

  return (
    <Widget title="Badges" className="h-full">
      <div className="overflow-y-auto h-full pr-2">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
          {flatBadges.map((badge) => {
            const isEarned = earnedBadgeIds.has(badge._id);
            const src = resolveImage(badge);
            // Tooltip content
            const tip = [badge.name, badge.collectionKey || badge.category].filter(Boolean).join(" • ");
            return (
              <div key={badge._id} className="aspect-square flex items-center justify-center" title={tip}>
                <img
                  src={src}
                  alt={badge.name || "badge"}
                  className={`w-full h-full object-contain transition-all duration-300 ${
                    isEarned ? "opacity-100" : "opacity-20 grayscale"
                  }`}
                  onError={(e) => {
                    // Hide broken image boxes silently
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Widget>
  );
};

export default BadgeDisplay;
