import { useEffect } from "react";
import PageHeader from "../components/ui/PageHeader";
import PersonaEditor from "../components/settings/PersonaEditor";

const SettingsPage = () => {
  return (
    <div>
      <PageHeader title="Persona Manager" subtitle="Edit persona palettes, fonts, and preview them live." />
      <PersonaEditor />
    </div>
  );
};

export default SettingsPage;
