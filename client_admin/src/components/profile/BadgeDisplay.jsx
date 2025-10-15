import Widget from "../ui/Widget";

const BadgeDisplay = ({ allBadges = [], earnedBadges = [] }) => {
  const earnedBadgeIds = new Set(earnedBadges.map((b) => b.badgeBase._id));

  // Group all badges by their category (e.g., "Pokémon Gen 1")
  const groupedBadges = allBadges.reduce((acc, badge) => {
    const category = badge.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(badge);
    return acc;
  }, {});

  return (
    <Widget title="Badges Earned" className="h-full">
      <div className="space-y-6 overflow-y-auto h-full pr-2">
        {Object.entries(groupedBadges).map(([category, badges]) => (
          <div key={category}>
            <h4 className="font-semibold text-text-secondary mb-2">{category}</h4>
            <div className="grid grid-cols-4 gap-4">
              {badges.map((badge) => {
                const isEarned = earnedBadgeIds.has(badge._id);
                return (
                  <div key={badge._id} className="aspect-square flex items-center justify-center" title={badge.name}>
                    <img
                      src={badge.imageUrl}
                      alt={badge.name}
                      className={`w-full h-full object-contain transition-all duration-300 ${
                        isEarned ? "opacity-100" : "opacity-20 grayscale"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
};

export default BadgeDisplay;
