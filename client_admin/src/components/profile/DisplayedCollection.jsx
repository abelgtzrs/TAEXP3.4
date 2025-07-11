import Widget from "../ui/Widget";

const DisplayedCollection = ({ title, items, baseField }) => {
  // --- THIS IS THE FIX ---
  // We ensure that 'items' is treated as an array, even if it's undefined or null.
  // We also create a new array to avoid modifying the original.
  const displayItems = Array.isArray(items) ? [...items] : [];

  // Fill the rest of the grid with nulls for consistent spacing.
  while (displayItems.length < 6) {
    displayItems.push(null);
  }

  return (
    <Widget title={title}>
      <div className="grid grid-cols-6 gap-4">
        {displayItems.map((item, index) => {
          const baseItem = item ? item[baseField] : null;

          return (
            <div
              key={item?._id || index}
              className="p-2 bg-gray-900/50 rounded-lg aspect-square flex flex-col items-center justify-center text-center"
            >
              {baseItem ? (
                <>
                  <div className="w-full h-3/4 flex items-center justify-center">
                    {baseItem.imageUrl ? (
                      <img
                        src={baseItem.imageUrl}
                        alt={baseItem.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">
                        [IMG]
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-300 leading-tight mt-1 h-1/4 overflow-hidden">
                    {baseItem.name}
                  </p>
                </>
              ) : (
                <div className="text-gray-600 text-2xl">+</div>
              )}
            </div>
          );
        })}
      </div>
    </Widget>
  );
};

export default DisplayedCollection;
