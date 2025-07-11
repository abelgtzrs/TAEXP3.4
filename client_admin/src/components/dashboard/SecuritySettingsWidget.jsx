// src/components/dashboard/SecuritySettingsWidget.jsx
import { useState } from "react";
import Widget from "./Widget";
import StyledToggle from "../ui/StyledToggle";

const SecuritySettingsWidget = () => {
  const [firewall, setFirewall] = useState(true);
  const [encryption, setEncryption] = useState(true);
  const [auth, setAuth] = useState(false);

  const settings = [
    { label: "Firewall", value: "Enabled", state: firewall, setState: setFirewall },
    { label: "Encryption", value: "AES-256", state: encryption, setState: setEncryption },
    { label: "Biometric Authentication", value: "Not Configured", state: auth, setState: setAuth },
  ];

  return (
    <Widget title="Security Settings" padding="p-0">
      <ul className="divide-y divide-gray-700/50">
        {settings.map((setting) => (
          <li key={setting.label} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-text-main">{setting.label}</p>
              <p className="text-xs text-text-secondary">{setting.value}</p>
            </div>
            <StyledToggle enabled={setting.state} setEnabled={setting.setState} />
          </li>
        ))}
      </ul>
    </Widget>
  );
};

export default SecuritySettingsWidget;
