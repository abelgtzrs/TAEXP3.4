import CoherenceChart from "./charts/CoherenceChart";
import AnomalyChart from "./charts/AnomalyChart";
import DriftChart from "./charts/DriftChart";
import SystemStatusChart from "./charts/SystemStatusChart";

// Combined dashboard showing all 4 charts in a 2x2 grid, filling the parent container
const LoreChartWidget = () => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full min-h-0">
      <div className="w-full h-full">
        <CoherenceChart />
      </div>
      <div className="w-full h-full">
        <AnomalyChart />
      </div>
      <div className="w-full h-full">
        <DriftChart />
      </div>
      <div className="w-full h-full">
        <SystemStatusChart />
      </div>
    </div>
  );
};

export default LoreChartWidget;
