import React from "react";
import CoherenceChart from "./charts/CoherenceChart";
import AnomalyChart from "./charts/AnomalyChart";
import DriftChart from "./charts/DriftChart";
import SystemStatusChart from "./charts/SystemStatusChart";
import { ChartDataProvider } from "./charts/ChartDataContext";
import ChartEditorModal from "./charts/ChartEditorModal";

const typeToTab = {
  coherence: "coherence",
  anomaly: "anomaly",
  drift: "drift",
  status: "status",
};

const typeToComponent = {
  coherence: CoherenceChart,
  anomaly: AnomalyChart,
  drift: DriftChart,
  status: SystemStatusChart,
};

export default function SingleLoreChartWidget({ type = "coherence" }) {
  const [open, setOpen] = React.useState(false);
  const initialTab = typeToTab[type] || "coherence";
  const ChartComp = typeToComponent[type] || CoherenceChart;

  return (
    <ChartDataProvider>
      <div className="relative h-full min-h-0">
        <button
          onClick={() => setOpen(true)}
          className="absolute right-2 top-2 z-10 px-2 py-1 text-[11px] rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-600"
          title={`Edit ${initialTab}`}
        >
          Edit
        </button>
        <ChartComp />
      </div>
      <ChartEditorModal isOpen={open} onClose={() => setOpen(false)} initialTab={initialTab} />
    </ChartDataProvider>
  );
}
