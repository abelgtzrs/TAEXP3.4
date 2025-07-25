import Widget from "../ui/Widget";
import { Facebook, Twitter, Youtube } from "lucide-react"; // Example icons

const SocialSalesWidget = () => {
  const sources = [
    { name: "Facebook", value: 34848.17, icon: <Facebook size={16} className="text-blue-500" /> },
    { name: "Twitter", value: 8589.75, icon: <Twitter size={16} className="text-sky-400" /> },
    { name: "YouTube", value: 3621.79, icon: <Youtube size={16} className="text-red-500" /> },
  ];

  return (
    <Widget title="Acquisition by Social Source">
      <p className="text-3xl font-bold text-primary mb-1">$70,563.43</p>
      <p className="text-xs text-green-400 mb-6">+45.7% vs last month</p>
      <ul className="space-y-3">
        {sources.map((source) => (
          <li key={source.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              {source.icon}
              <span className="text-text-secondary">{source.name}</span>
            </div>
            <span className="font-mono text-text-main">${source.value.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </Widget>
  );
};

export default SocialSalesWidget;
