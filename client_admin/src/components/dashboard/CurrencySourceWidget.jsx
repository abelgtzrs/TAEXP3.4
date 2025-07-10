import Widget from "./Widget";
import { useAuth } from "../../context/AuthContext";

const CurrencySourceWidget = () => {
  const { user } = useAuth();

  const currencies = [
    { name: "Temu Tokens (Habits)", value: user?.temuTokens || 0, color: "bg-yellow-400" },
    { name: "Gatilla Gold (Workouts)", value: user?.gatillaGold || 0, color: "bg-amber-400" },
    { name: "Wendy Hearts (Reading)", value: user?.wendyHearts || 0, color: "bg-pink-400" },
  ];

  // Calculate total for percentage bars
  const total = currencies.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Widget title="Currency Acquisition">
      <div className="space-y-4">
        {currencies.map((currency) => {
          const percentage = total > 0 ? (currency.value / total) * 100 : 0;
          return (
            <div key={currency.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">{currency.name}</span>
                <span className="text-white font-semibold">{currency.value.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className={`${currency.color} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </Widget>
  );
};

export default CurrencySourceWidget;
