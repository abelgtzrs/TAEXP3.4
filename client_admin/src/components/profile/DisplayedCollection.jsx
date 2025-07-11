import Widget from "../dashboard/Widget";

const DisplayedCollection = ({ title, items = [], baseField, placeholderText = "Nothing displayed yet." }) => {
  // Ensure items is always an array before using spread operator
  const safeItems = Array.isArray(items) ? items : [];
  const displayItems = [...safeItems];
  while (displayItems.length < 6) {
    displayItems.push(null);
  }

  return (
    <Widget title={title}>
      <div className="grid grid-cols-6 gap-4" style={{ aspectRatio: "5/1" }}>
        {displayItems.map((item, index) => {
          const baseItem = item ? item[baseField] : null;

          return (
            <div
              key={item?._id || index}
              className="p-2 bg-gray-900/50 rounded-lg flex flex-col items-center justify-center text-center h-full"
            >
              {baseItem ? (
                <>
                  {/* This div now takes a fraction of the parent's height for better spacing */}
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
