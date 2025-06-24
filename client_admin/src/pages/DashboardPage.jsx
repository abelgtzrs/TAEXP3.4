// --- FILE: client-admin/src/pages/DashboardPage.jsx (Updated) ---

import { useAuth } from '../context/AuthContext';
import MetricCard from '../components/dashboard/MetricCard';
import LoreChartWidget from '../components/dashboard/LoreChartWidget';
import SystemStatusWidget from '../components/dashboard/SystemStatusWidget';

const DashboardPage = () => {
    const { user } = useAuth(); // Get the logged-in user's data from our global context

    return (
        <div>
            {/* --- Main Header --- */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome back, {user?.email || 'Admin'}.</h1>
                <p className="text-gray-400">Here is the current status of the Experience.</p>
            </div>

            {/* --- Main Grid Layout (12 columns) --- */}
            <div className="grid grid-cols-12 gap-6">

                {/* Top Row: Metric Cards */}
                <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <MetricCard title="Habits Completed" value="74" change="3.2%" changeType="increase" />
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <MetricCard title="Books Finished" value="8" change="1.1%" changeType="decrease" />
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <MetricCard title="Gacha Pulls" value="128" change="15%" changeType="increase" />
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <MetricCard title="Active Streaks" value="4" change="0" changeType="increase" />
                </div>
                
                {/* Middle Row: Main Chart and Status Widgets */}
                <div className="col-span-12 lg:col-span-8">
                    <LoreChartWidget />
                </div>
                <div className="col-span-12 lg:col-span-4">
                    <SystemStatusWidget />
                </div>

                {/* You can continue adding more widgets here */}
                {/* <div className="col-span-12"> ... </div> */}
            </div>
        </div>
    );
};

export default DashboardPage;