import Widget from "../ui/Widget";

const RecentAcquisitionsWidget = ({ acquisitions, loading }) => {
  const displayItems = acquisitions || [];

  return (
    <Widget title="Recent Acquisitions">
      {loading ? (
        <p className="text-sm text-text-tertiary">Loading...</p>
      ) : displayItems.length > 0 ? (
        <ul className="space-y-3">
          {displayItems.map((item, index) => (
            <li key={index} className="flex items-center justify-between text-sm">
              <div>
                <p className="text-white font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">{item.type}</p>
              </div>
              <span className="font-mono text-teal-400">{item.rarity.replace(/_/g, " ")}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-text-tertiary">No items acquired recently.</p>
      )}
    </Widget>
  );
};

export default RecentAcquisitionsWidget;
