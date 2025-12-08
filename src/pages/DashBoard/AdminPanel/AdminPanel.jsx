import { DashboardLink } from '../../../Components/DashboardLink'
import { SummaryCard } from '../../../Components/SummaryCard'

export const AdminPanel = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <SummaryCard title="Total Users" value="120" />
        <SummaryCard title="Total Clubs" value="12" />
        <SummaryCard title="Total Memberships" value="560" />
        <SummaryCard title="Total Payments" value="$12,400" />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Memberships per Club</h2>
        <div className="w-full h-64 flex items-center justify-center text-gray-500">
          {/* Replace with actual chart */}
          Chart Placeholder (Bar/Line/Pie)
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <DashboardLink
          title="Manage Users"
          description="View & update user roles"
          to="/dashboard/manage-users"
        />
        <DashboardLink
          title="Manage Clubs"
          description="Approve or reject clubs"
          to="/dashboard/manage-clubs"
        />
        <DashboardLink
          title="Payments"
          description="View all transactions"
          to="/dashboard/payments"
        />
      </div>
    </div>
  );
};
