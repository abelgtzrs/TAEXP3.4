import { Link } from "react-router-dom";

const collectionLinks = [
  { type: "pokemon", name: "My Pokédex", icon: "🐾" },
  { type: "snoopy", name: "Snoopy Gallery", icon: "🐶" },
  { type: "habbo", name: "Habbo Rare Furni", icon: "🛋️" },
  { type: "yugioh", name: "Yu-Gi-Oh! Binder", icon: "🃏" }, // Correct type 'yugioh'
];

const CollectionsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-teal-400 mb-8">My Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collectionLinks.map((link) => (
          <Link
            key={link.type}
            to={`/collections/${link.type}`}
            className="p-8 bg-gray-800 rounded-lg flex items-center gap-6 hover:bg-gray-700 hover:border-teal-500 border-2 border-transparent transition-all duration-300"
          >
            <span className="text-5xl">{link.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-white">{link.name}</h2>
              <p className="text-gray-400">View and manage your {link.name} collection.</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CollectionsPage;
