import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Widget from './Widget';

const MetricCard = ({ title, value, change, changeType }) => {
  const isIncrease = changeType === 'increase';
  const changeColor = isIncrease ? 'text-green-400' : 'text-red-400';
  const Icon = isIncrease ? ArrowUpRight : ArrowDownRight;

  return (
    <Widget title={title}>
      <div className="flex items-baseline justify-between">
        <p className="text-4xl font-semibold text-white text-glow">{value}</p>
        <div className={`flex items-center text-lg font-medium ${changeColor}`}>
          <Icon size={20} className="mr-1" />
          <span>{change}</span>
        </div>
      </div>
    </Widget>
  );
};

export default MetricCard;