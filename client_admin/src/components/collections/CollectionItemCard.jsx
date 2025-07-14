import { CheckCircle, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

const CollectionItemCard = ({ item, config, onSelect, isDisplayed, isDisplayFull, isCompact = false }) => {
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
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="flex flex-col text-center transition-all duration-300 group h-full"
    >
      <div
        className={`widget-container p-4 flex flex-col flex-grow ${
          isDisplayed ? "border-teal-400 bg-teal-900/20" : ""
        }`}
      >
        <div className={`w-full ${isCompact ? "aspect-square" : "h-80"} mb-4 flex items-center justify-center`}>
          {imageUrl ? (
            <motion.img
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
              src={imageUrl}
              alt={baseItem.name}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">
              [IMG]
            </div>
          )}
        </div>
        <div className="flex-grow" />
        <motion.button
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(item._id, isDisplayed)}
          disabled={buttonDisabled}
          className={`w-full mt-2 text-xs font-bold py-2 rounded-md transition duration-300 flex items-center justify-center gap-1 ${buttonClass}`}
        >
          {/* For the remove button, we show a different text on hover */}
          {isDisplayed ? (
            <>
              <motion.span
                className="group-hover:hidden flex items-center gap-1"
                initial={{ opacity: 1 }}
                whileHover={{ opacity: 0 }}
              >
                {buttonIcon} {buttonText}
              </motion.span>
              <motion.span className="hidden group-hover:inline" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}>
                Remove from Profile
              </motion.span>
            </>
          ) : (
            <motion.span className="flex items-center gap-1">
              {buttonIcon} {buttonText}
            </motion.span>
          )}
        </motion.button>
      </div>
      <div className="mt-2 px-1 h-12 flex flex-col justify-center items-center">
        <p className="text-sm font-semibold text-white leading-tight whitespace-normal break-words max-w-full">
          {baseItem.name}
        </p>
        {item.variant && item.variant !== "Normal" && <p className="text-xs text-yellow-400 mt-0.5">{item.variant}</p>}
      </div>
    </motion.div>
  );
};

export default CollectionItemCard;
