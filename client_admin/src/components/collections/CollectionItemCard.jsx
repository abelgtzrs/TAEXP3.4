import { CheckCircle, PlusCircle } from "lucide-react";

const CollectionItemCard = ({ item, config, onSelect, isDisplayed, isDisplayFull }) => {
  // Safely get the base item which contains the name, image, etc.
  const baseItem = item ? item[config.baseField] : null;

  if (!baseItem) return null; // Don't render if data is malformed

  // --- THIS IS THE FIX for Pokémon sprites ---
  // We check if the item is a Pokémon and get the sprite from the nested 'forms' array.
  // For all other collectibles, we use the standard 'imageUrl'.
  const imageUrl =
    config.baseField === "basePokemon"
      ? baseItem.forms[0]?.spriteGen5Animated || baseItem.forms[0]?.spriteGen6Animated
      : baseItem.imageUrl;

  // --- Button Logic ---
  let buttonDisabled = false;
  let buttonText = "Add to Profile";
  let buttonIcon = <PlusCircle size={14} />;
  let buttonClass = "bg-teal-600 hover:bg-teal-500";

  if (isDisplayed) {
    buttonText = "Displayed";
    buttonIcon = <CheckCircle size={14} />;
    buttonClass = "bg-green-700 hover:bg-red-800"; // On hover, suggest removal
  } else if (isDisplayFull) {
    buttonText = "Profile Full";
    buttonDisabled = true;
    buttonClass = "bg-gray-600 cursor-not-allowed";
  }

  return (
    <div
      className={`widget-container p-4 flex flex-col text-center transition-all duration-300 group ${
        isDisplayed ? "border-teal-400" : ""
      }`}
    >
      <div className="w-full h-32 mb-2 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={baseItem.name} className="max-w-full max-h-full object-contain" />
        ) : (
          <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">
            [IMG]
          </div>
        )}
      </div>
      <p className="text-sm font-semibold text-white flex-grow">{baseItem.name}</p>
      {item.variant && item.variant !== "Normal" && <p className="text-xs text-yellow-400">{item.variant}</p>}

      <button
        onClick={() => onSelect(item._id, isDisplayed)}
        disabled={buttonDisabled}
        className={`w-full mt-2 text-xs font-bold py-2 rounded-md transition duration-300 flex items-center justify-center gap-1 ${buttonClass}`}
      >
        {/* For the remove button, we show a different text on hover */}
        {isDisplayed ? (
          <>
            <span className="group-hover:hidden">
              {buttonIcon} {buttonText}
            </span>
            <span className="hidden group-hover:inline">Remove from Profile</span>
          </>
        ) : (
          <>
            {buttonIcon} {buttonText}
          </>
        )}
      </button>
    </div>
  );
};

export default CollectionItemCard;
