import { DashboardLink } from '../../../Components/DashboardLink'
import { SummaryCard } from '../../../Components/SummaryCard'
import { useState, useContext } from "react";
import { AuthContext } from '../../../context/AuthContext/AuthContext';


export const ManageUsers = () => {
  const { user } = useContext(AuthContext);

  // Placeholder states (to replace with TanStack Query fetch)
  const [summary, setSummary] = useState({
    clubsManaged: 2,
    totalMembers: 120,
    totalEvents: 15,
    totalPayments: 4500,
  });

  return (
    <div className="p-6 space-y-8">

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800">Club Manager Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Clubs Managed" value={summary.clubsManaged} />
        <SummaryCard title="Total Members" value={summary.totalMembers} />
        <SummaryCard title="Total Events" value={summary.totalEvents} />
        <SummaryCard title="Total Payments Received" value={`$${summary.totalPayments}`} />
      </div>

      {/* Quick Navigation / Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <DashboardLink title="My Clubs" description="View & edit your clubs" to="/dashboard/manager/my-clubs" />
        <DashboardLink title="Club Members" description="See members of your clubs" to="/dashboard/manager/club-members" />
        <DashboardLink title="Events Management" description="Manage events for your clubs" to="/dashboard/manager/events" />
        <DashboardLink title="Event Registrations" description="View registrations per event" to="/dashboard/manager/event-registrations" />
      </div>

      {/* Placeholder for charts / stats */}
      <div className="bg-white p-6 rounded-xl shadow h-64 flex items-center justify-center text-gray-500">
        Charts & stats placeholder (Integrate Recharts / Chart.js later)
      </div>

    </div>
  );
};
