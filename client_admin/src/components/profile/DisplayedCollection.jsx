// src/components/profile/DisplayedCollection.jsx

const DisplayedCollection = ({ title, items, baseField, placeholderText = "Nothing displayed yet." }) => {
    // Fill the array with nulls up to 6 items for consistent grid display
    const displayItems = [...items];
    while (displayItems.length < 6) {
        displayItems.push(null);
    }
    
    return (
        <div className="widget-container p-6">
            <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {displayItems.map((item, index) => {
                    // The base item contains the actual name and image url
                    const baseItem = item ? item[baseField] : null;

                    return (
                        <div key={item?._id || index} className="p-2 bg-gray-900/50 rounded-lg aspect-w-1 aspect-h-1 flex flex-col items-center justify-center text-center">
                            {baseItem ? (
                                <>
                                    <div className="w-16 h-16 mb-2">
                                        {baseItem.imageUrl ? 
                                            <img src={baseItem.imageUrl} alt={baseItem.name} className="w-full h-full object-contain" /> :
                                            <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">[IMG]</div>
                                        }
                                    </div>
                                    <p className="text-xs font-semibold text-gray-300">{baseItem.name}</p>
                                </>
                            ) : (
                                <div className="text-gray-600 text-2xl">+</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DisplayedCollection;