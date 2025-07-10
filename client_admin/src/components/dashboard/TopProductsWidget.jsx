import Widget from "../ui/Widget";

const TopProductsWidget = () => {
  const products = [
    { name: "Abel Persona: Stoic", units: 210 },
    { name: "Snoopy: Joe Cool", units: 198 },
    { name: "Pokémon: Eevee", units: 188 },
    { name: "Habbo Rare: Throne", units: 130 },
  ];

  return (
    <Widget title="Top Collectibles by Units Acquired">
      <ul className="space-y-4">
        {products.map((product) => (
          <li key={product.name} className="flex items-center justify-between text-sm">
            <span className="text-text-main">{product.name}</span>
            <span className="font-mono text-primary">{product.units}</span>
          </li>
        ))}
      </ul>
    </Widget>
  );
};

export default TopProductsWidget;
