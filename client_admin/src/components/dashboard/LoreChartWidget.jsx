import CoherenceChart from "./charts/CoherenceChart";
import AnomalyChart from "./charts/AnomalyChart";
import DriftChart from "./charts/DriftChart";
import SystemStatusChart from "./charts/SystemStatusChart";
import { ChartDataProvider } from "./charts/ChartDataContext";
import ChartEditorModal from "./charts/ChartEditorModal";
import React from "react";

// Combined dashboard showing all 4 charts in a 2x2 grid, filling the parent container
const LoreChartWidget = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <ChartDataProvider>
      <div className="relative h-full min-h-0">
        <div className="absolute right-2 top-2 z-10">
          <button
            onClick={() => setOpen(true)}
            className="px-3 py-1.5 text-xs rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-600"
            title="Edit chart values"
          >
            Edit Charts
          </button>
        </div>
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
      </div>
      <ChartEditorModal isOpen={open} onClose={() => setOpen(false)} />
    </ChartDataProvider>
  );
};

export default LoreChartWidget;
