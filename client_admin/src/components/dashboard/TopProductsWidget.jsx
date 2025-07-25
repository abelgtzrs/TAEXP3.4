import Widget from "../ui/Widget";

const TopProductsWidget = ({ products, loading }) => {
  const displayProducts = products || [];

  return (
    <Widget title="Top Collectibles by Units Acquired">
      {loading ? (
        <p className="text-sm text-text-tertiary">Loading...</p>
      ) : (
        <ul className="space-y-4">
          {displayProducts.map((product) => (
            <li key={product.name} className="flex items-center justify-between text-sm">
              <span className="text-text-main">{product.name}</span>
              <span className="font-mono text-primary">{product.units}</span>
            </li>
          ))}
        </ul>
      )}
    </Widget>
  );
};

export default TopProductsWidget;
