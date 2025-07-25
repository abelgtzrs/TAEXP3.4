import Widget from "../ui/Widget";

// In a real app, you would fetch this data. For now, it's mocked.
const mockAcquisitions = [
  { name: "Pikachu", rarity: "common", type: "Pokémon" },
  { name: "Classic Snoopy", rarity: "uncommon", type: "Snoopy" },
  { name: "Throne", rarity: "super_rare", type: "Habbo Rare" },
  { name: "Blue-Eyes White Dragon", rarity: "ultra_card", type: "Yu-Gi-Oh! Card" },
];

const RecentAcquisitionsWidget = () => {
  return (
    <Widget title="Recent Acquisitions">
      <ul className="space-y-3">
        {mockAcquisitions.map((item) => (
          <li key={item.name} className="flex items-center justify-between text-sm">
            <div>
              <p className="text-white font-medium">{item.name}</p>
              <p className="text-xs text-gray-500">{item.type}</p>
            </div>
            <span className="font-mono text-teal-400">{item.rarity.replace("_", " ")}</span>
          </li>
        ))}
      </ul>
    </Widget>
  );
};

export default RecentAcquisitionsWidget;
