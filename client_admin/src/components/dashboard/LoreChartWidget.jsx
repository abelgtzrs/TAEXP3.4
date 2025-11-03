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
  const [initialTab, setInitialTab] = React.useState("coherence");
  return (
    <ChartDataProvider>
      <div className="relative h-full min-h-0">
        <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full min-h-0">
          <div className="w-full h-full relative">
            <button
              onClick={() => {
                setInitialTab("coherence");
                setOpen(true);
              }}
              className="absolute right-2 top-2 z-10 px-2 py-1 text-[11px] rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-600"
              title="Edit Coherence"
            >
              Edit
            </button>
            <CoherenceChart />
          </div>
          <div className="w-full h-full relative">
            <button
              onClick={() => {
                setInitialTab("anomaly");
                setOpen(true);
              }}
              className="absolute right-2 top-2 z-10 px-2 py-1 text-[11px] rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-600"
              title="Edit Anomaly"
            >
              Edit
            </button>
            <AnomalyChart />
          </div>
          <div className="w-full h-full relative">
            <button
              onClick={() => {
                setInitialTab("drift");
                setOpen(true);
              }}
              className="absolute right-2 top-2 z-10 px-2 py-1 text-[11px] rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-600"
              title="Edit Drift"
            >
              Edit
            </button>
            <DriftChart />
          </div>
          <div className="w-full h-full relative">
            <button
              onClick={() => {
                setInitialTab("status");
                setOpen(true);
              }}
              className="absolute right-2 top-2 z-10 px-2 py-1 text-[11px] rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-600"
              title="Edit System Status"
            >
              Edit
            </button>
            <SystemStatusChart />
          </div>
        </div>
      </div>
      <ChartEditorModal isOpen={open} onClose={() => setOpen(false)} initialTab={initialTab} />
    </ChartDataProvider>
  );
};

export default LoreChartWidget;
