// --- FILE: client-admin/src/components/shop/PullResultModal.jsx (Corrected) ---

const PullResultModal = ({ result, onClose }) => {
  // If there's no result data at all, render nothing.
  if (!result) return null;

  // --- THIS IS THE FIX ---
  // 1. Safely access the nested 'data' object from the API response.
  const nestedData = result.data || {};
  // 2. Destructure the 'item' from the nested data.
  const { item } = nestedData;
  // 3. Get the 'message' from the top-level result object.
  const { message } = result;

  // 4. CRITICAL CHECK: If the 'item' itself doesn't exist for any reason,
  //    we stop here and render nothing to prevent the crash.
  if (!item) return null;

  // 5. Create generic variables for display, checking for different possible property names.
  //    This makes the component work for Snoopys, Personas, and Pokémon.
  let displayImageUrl = item.imageUrl || item.iconUrlOrKey;

  // For Pokémon, check for sprite URLs in the forms array
  if (!displayImageUrl && item.forms && item.forms.length > 0) {
    const firstForm = item.forms[0];
    displayImageUrl = firstForm.spriteGen5Animated || firstForm.spriteGen6Animated;
  }

  const displayRarity = item.rarity || item.rarityCategory || item.systemRarity;

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
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="widget-container p-8 rounded-lg shadow-2xl text-center max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-4">{message}</h2>
        <div className="my-6 p-4 bg-gray-900/50 rounded-lg">
          {displayImageUrl ? (
            <img src={displayImageUrl} alt={item.name} className="h-30 mx-auto object-contain" />
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-500">[No Image]</div>
          )}
          <p className="mt-4 text-xl font-semibold text-white">{item.name}</p>
          {displayRarity && (
            <p className={`font-bold uppercase text-sm ${rarityColor[displayRarity] || "text-gray-300"}`}>
              {displayRarity.replace(/_/g, " ")}
            </p>
          )}
        </div>
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
