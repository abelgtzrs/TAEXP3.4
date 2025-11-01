// src/components/shop/GachaCard.jsx

const GachaCard = ({ title, description, cost, currencyName, currencySymbol, onPull, isLoading }) => {
  return (
    // The main container for the card, using our widget styles as a base.
    <div
      className="flex flex-col items-center text-center p-6 rounded-lg border w-full glass-surface"
      style={{ borderColor: "var(--color-primary)" }}
    >
      <h2 className="text-2xl font-bold text-text-main mb-2">{title}</h2>
      <p className="text-sm text-text-secondary flex-grow mb-4">{description}</p>

      <div className="mb-4">
        <span className="text-3xl font-bold text-primary">{cost}</span>
        <span className="ml-2 text-lg text-text-secondary">
          {currencySymbol} {currencyName}
        </span>
      </div>

      <button
        onClick={onPull}
        disabled={isLoading}
        className="w-full bg-primary hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "Pulling..." : "Get Random Item"}
      </button>
    </div>
  );
};

export default GachaCard;
