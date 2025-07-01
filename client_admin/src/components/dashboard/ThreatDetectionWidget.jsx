import Widget from "../ui/Widget";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

const ThreatGauge = ({ value, label, color }) => {
  // Recharts expects data as an array of objects
  const data = [{ name: label, value: value }];
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20">
        <ResponsiveContainer>
          <RadialBarChart innerRadius="80%" outerRadius="100%" barSize={8} data={data} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              background={{ fill: "rgba(55, 65, 81, 0.5)" }} // gray-700/50
              dataKey="value"
              fill={color}
              cornerRadius={4}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-2xl font-semibold text-white -mt-14" style={{ textShadow: `0 0 8px ${color}` }}>
        {value}
      </p>
      <p className="text-xs text-text-secondary mt-10 uppercase tracking-wider">{label}</p>
    </div>
  );
};

const ThreatDetectionWidget = ({ className }) => {
  const threats = [
    { type: "IPS", severity: "High", status: "Flagged" },
    { type: "Firewall", severity: "Medium", status: "DDoS" },
    { type: "Endpoint", severity: "Critical", status: "SQL" },
    { type: "IDS", severity: "Low", status: "Injection" },
  ];

  return (
    <Widget title="Threat Detection" className={className}>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <ThreatGauge value={450} label="Threats" color="#34d399" />
        <ThreatGauge value={20} label="False Pos" color="#facc15" />
      </div>
      <div className="text-xs text-text-secondary">
        <div className="grid grid-cols-3 font-bold uppercase border-b border-gray-700 pb-1 mb-1">
          <span>Type</span>
          <span>Status</span>
          <span className="text-right">Severity</span>
        </div>
        <ul className="space-y-1">
          {threats.map((threat) => (
            <li key={threat.type} className="grid grid-cols-3 font-mono">
              <span>{threat.type}</span>
              <span>{threat.status}</span>
              <span className="text-right">{threat.severity}</span>
            </li>
          ))}
        </ul>
      </div>
    </Widget>
  );
};

export default ThreatDetectionWidget;
