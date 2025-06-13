import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Placeholder for Sidebar */}
      <aside className="w-64 bg-gray-800 p-4">
        <h2 className="text-white font-bold text-xl">Sidebar</h2>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6">
        {/* Outlet renders the child route's component (e.g., DashboardPage) */}
        <Outlet />
      </main>
    </div>
  );
};
export default AdminLayout;
