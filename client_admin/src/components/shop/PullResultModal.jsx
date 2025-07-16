// --- FILE: client-admin/src/components/shop/PullResultModal.jsx (Corrected) ---

const PullResultModal = ({ result, onClose }) => {
  // If there's no result data at all, render nothing.
  if (!result) return null;

  // --- UPDATED FOR PACKS AND SINGLE ITEMS ---
  // 1. Safely access the nested 'data' object from the API response.
  const nestedData = result.data || {};
  // 2. Check for both single item and multiple items (pack)
  const { item, items } = nestedData;
  // 3. Get the 'message' from the top-level result object.
  const { message } = result;

  // 4. CRITICAL CHECK: If neither single item nor items array exists, render nothing
  if (!item && (!items || items.length === 0)) return null;

  // 5. Determine if this is a pack pull or single pull
  const isPack = items && items.length > 0;
  const displayItems = isPack ? items : [item];

  // Helper function to get display properties for any item
  const getDisplayProps = (item) => {
    let displayImageUrl = item.imageUrl || item.iconUrlOrKey;

    // For Pokémon, check for sprite URLs in the forms array
    if (!displayImageUrl && item.forms && item.forms.length > 0) {
      const firstForm = item.forms[0];
      displayImageUrl = firstForm.spriteGen5Animated || firstForm.spriteGen6Animated;
    }

    const displayRarity = item.rarity || item.rarityCategory || item.systemRarity;

    return { displayImageUrl, displayRarity };
  };

  const rarityColor = {
    common: "text-gray-300",
    uncommon: "text-green-400",
    rare: "text-blue-400",
    super_rare: "text-purple-400",
    ultra_rare: "text-yellow-400",
    epic: "text-purple-400",
    legendary_snoopy: "text-yellow-400",
    common_card: "text-gray-300",
    super_card: "text-purple-400",
    ultra_card: "text-yellow-400",
    common_rare: "text-gray-300",
    Common: "text-gray-300",
    Rare: "text-blue-400",
    "Super Rare": "text-purple-400",
    "Ultra Rare": "text-yellow-400",
    "Secret Rare": "text-red-400",
    "Ultimate Rare": "text-orange-400",
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`widget-container p-8 rounded-lg shadow-2xl text-center w-full mx-4 ${
          isPack ? "max-w-4xl" : "max-w-sm"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-4">{message}</h2>

        {isPack ? (
          // Pack display - grid of cards
          <div className="my-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {displayItems.map((item, index) => {
                const { displayImageUrl, displayRarity } = getDisplayProps(item);
                return (
                  <div key={index} className="p-3 bg-gray-900/50 rounded-lg">
                    {displayImageUrl ? (
                      <img src={displayImageUrl} alt={item.name} className="h-32 mx-auto object-contain mb-2" />
                    ) : (
                      <div className="h-32 flex items-center justify-center text-gray-500 mb-2">[No Image]</div>
                    )}
                    <p className="text-sm font-semibold text-white mb-1">{item.name}</p>
                    {displayRarity && (
                      <p className={`font-bold uppercase text-xs ${rarityColor[displayRarity] || "text-gray-300"}`}>
                        {displayRarity.replace(/_/g, " ")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Single item display - original layout
          <div className="my-6 p-4 bg-gray-900/50 rounded-lg">
            {(() => {
              const { displayImageUrl, displayRarity } = getDisplayProps(displayItems[0]);
              return (
                <>
                  {displayImageUrl ? (
                    <img src={displayImageUrl} alt={displayItems[0].name} className="h-40 mx-auto object-contain" />
                  ) : (
                    <div className="h-40 flex items-center justify-center text-gray-500">[No Image]</div>
                  )}
                  <p className="mt-4 text-xl font-semibold text-white">{displayItems[0].name}</p>
                  {displayRarity && (
                    <p className={`font-bold uppercase text-sm ${rarityColor[displayRarity] || "text-gray-300"}`}>
                      {displayRarity.replace(/_/g, " ")}
                    </p>
                  )}
                </>
              );
            })()}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
};

export default PullResultModal;
