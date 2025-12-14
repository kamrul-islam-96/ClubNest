import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { DashboardLink } from "../../../Components/DashboardLink";
import { SummaryCard } from "../../../Components/SummaryCard";

export const AdminPanel = () => {
  const { user } = useContext(AuthContext);

  // Fetch all users
  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    enabled: !!user,
  });

  // Fetch all clubs
  const {
    data: clubs = [],
    isLoading: clubsLoading,
    error: clubsError,
  } = useQuery({
    queryKey: ["allClubs"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clubs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch clubs");
      return res.json();
    },
    enabled: !!user,
  });

  // Fetch all memberships (for admin summary)
  const {
    data: memberships = [],
    isLoading: membershipsLoading,
    error: membershipsError,
  } = useQuery({
    queryKey: ["allMemberships"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/memberships`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch memberships");
      return res.json();
    },
    enabled: !!user,
  });

  // Fetch all payments
  const {
    data: payments = [],
    isLoading: paymentsLoading,
    error: paymentsError,
  } = useQuery({
    queryKey: ["allPayments"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch payments");
      return res.json();
    },
    enabled: !!user,
  });

  // Loading state
  if (usersLoading || clubsLoading || membershipsLoading || paymentsLoading)
    return (
      <div className="p-6 flex justify-center items-center h-40">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );

  // Error state
  if (usersError || clubsError || membershipsError || paymentsError)
    return (
      <p className="p-6 text-red-500">
        Error loading dashboard:{" "}
        {usersError?.message ||
          clubsError?.message ||
          membershipsError?.message ||
          paymentsError?.message}
      </p>
    );

  // Sum all payments
  const totalPaymentsAmount = payments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Total Users" value={users.length} />
        <SummaryCard title="Total Clubs" value={clubs.length} />
        <SummaryCard title="Total Memberships" value={memberships.length} />
        <SummaryCard
          title="Total Payments"
          value={`$${totalPaymentsAmount.toLocaleString()}`}
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Memberships per Club</h2>
        <div className="w-full h-64 flex items-center justify-center text-gray-500">
          Chart Placeholder (Bar/Line/Pie)
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <DashboardLink
          title="Manage Users"
          description="View & update user roles"
          to="/dashboard/admin/manage-users"
        />
        <DashboardLink
          title="Manage Clubs"
          description="Approve or reject clubs"
          to="/dashboard/admin/manage-clubs"
        />
        <DashboardLink
          title="Payments"
          description="View all transactions"
          to="/dashboard/admin/payments"
        />
      </div>
    </div>
  );
};
