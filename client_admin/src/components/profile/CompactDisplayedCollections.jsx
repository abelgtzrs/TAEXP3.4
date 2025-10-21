import React from "react";

const CompactDisplayedCollections = ({
  displayedPokemon = [],
  displayedSnoopyArt = [],
  displayedHabboRares = [],
  displayedYugiohCards = [],
}) => {
  const serverBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").split("/api")[0];

  const getPokemonSprite = (basePokemon) => {
    if (!basePokemon) return null;
    const firstForm = basePokemon.forms?.[0];
    const sprite = firstForm?.spriteGen6Animated || firstForm?.spriteGen5Animated || null;
    return sprite ? `${serverBaseUrl}${sprite}` : null;
  };

  const getImageUrl = (baseItem) => {
    if (!baseItem) return null;
    let imageUrl = baseItem.imageUrl;
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;
    imageUrl = imageUrl.replace(/^public\//, "").replace(/^\/public\//, "");
    imageUrl = imageUrl.replace(/^\//, "");
    return `${serverBaseUrl}/${imageUrl}`;
  };

  const Section = ({ title, items, baseField, getThumb }) => (
    <div className="rounded-lg border border-white/10 bg-white/5 p-2">
      <div className="text-xs text-slate-300 font-semibold mb-1">{title}</div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {items.map((item) => {
          const base = item?.[baseField];
          const thumb = getThumb ? getThumb(base) : getImageUrl(base);
          return (
            <div key={item?._id || base?._id} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center">
                {thumb ? (
                  <img src={thumb} alt={base?.name || "thumb"} className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-slate-500 text-[10px]">[IMG]</span>
                )}
              </div>
              <div className="mt-0.5 text-[10px] text-slate-200 truncate w-full" title={base?.name}>
                {base?.name || "Unknown"}
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="col-span-full text-center text-slate-400 text-xs py-3">No items displayed.</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-2">
      <Section title="Pokémon" items={displayedPokemon} baseField="basePokemon" getThumb={getPokemonSprite} />
      <Section title="Snoopys" items={displayedSnoopyArt} baseField="snoopyArtBase" />
      <Section title="Habbo Rares" items={displayedHabboRares} baseField="habboRareBase" />
      <Section title="Yu-Gi-Oh!" items={displayedYugiohCards} baseField="yugiohCardBase" />
    </div>
  );
};

export default CompactDisplayedCollections;
