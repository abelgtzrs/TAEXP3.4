// Compatibility wrapper: ensure any imports of './widgetRegistry' resolve without
// parsing JSX inside a .js file. Re-export from the .jsx module.
export { registry } from "./widgetRegistry.jsx";
