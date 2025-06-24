// src/components/shop/GachaCard.jsx

const GachaCard = ({ title, description, cost, currencyName, currencySymbol, onPull, isLoading }) => {
    return (
        // The main container for the card, using our widget styles as a base.
        <div className="widget-container flex flex-col items-center text-center p-6">
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <p className="text-sm text-gray-400 flex-grow mb-4">{description}</p>
            
            <div className="mb-4">
                <span className="text-3xl font-bold text-teal-400 text-glow">{cost}</span>
                <span className="ml-2 text-lg text-gray-300">{currencySymbol} {currencyName}</span>
            </div>

            <button
                onClick={onPull}
                disabled={isLoading}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Pulling...' : 'Get Random Item'}
            </button>
        </div>
    );
};

export default GachaCard;