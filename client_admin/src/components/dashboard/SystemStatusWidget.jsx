import Widget from "../ui/Widget";

const SystemStatusWidget = () => {
  const systems = [
    { name: "Nexus Point Stability", status: "Nominal", color: "bg-green-500" },
    { name: "Gacha Probability Engine", status: "Calibrating", color: "bg-yellow-500" },
    { name: "External API Link (Spotify)", status: "Offline", color: "bg-red-500" },
    { name: "Temporal Anomaly Detector", status: "Nominal", color: "bg-green-500" },
    { name: "Narrative Coherence Matrix", status: "Optimal", color: "bg-green-500" },
  ];

  return (
    <Widget title="Sub-System Diagnostics">
      <div className="space-y-3">
        {systems.map((system) => (
          <div key={system.name} className="flex items-center justify-between text-sm">
            <span className="text-gray-300">{system.name}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-gray-400">{system.status}</span>
              <div
                className={`w-2 h-2 rounded-full ${system.color}`}
                style={{ boxShadow: `0 0 6px ${system.color}` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
};

export default SystemStatusWidget;
