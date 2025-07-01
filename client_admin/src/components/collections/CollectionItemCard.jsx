// src/components/collections/CollectionItemCard.jsx
const CollectionItemCard = ({ item, baseField, onSelect, isDisplayed, isDisplayFull }) => {
  const baseItem = item ? item[baseField] : null;

  if (!baseItem) return null; // Don't render if item data is malformed

  // Determine button state and text
  let buttonDisabled = false;
  let buttonText = "Add to Profile";
  if (isDisplayed) {
    buttonText = "Remove from Profile";
  } else if (isDisplayFull) {
    buttonText = "Profile Full";
    buttonDisabled = true;
  }

  return (
    <div
      className={`widget-container p-4 flex flex-col text-center transition-all duration-300 ${
        isDisplayed ? "border-teal-400" : ""
      }`}
    >
      <div className="w-full h-32 mb-2 flex items-center justify-center">
        {baseItem.imageUrl ? (
          <img src={baseItem.imageUrl} alt={baseItem.name} className="max-w-full max-h-full object-contain" />
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
        className={`w-full mt-2 text-xs font-bold py-2 rounded-md transition duration-300 
                    ${isDisplayed ? "bg-red-800 hover:bg-red-700" : "bg-teal-600 hover:bg-teal-500"}
                    ${buttonDisabled && !isDisplayed ? "bg-gray-600 cursor-not-allowed" : ""}
                `}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default CollectionItemCard;
