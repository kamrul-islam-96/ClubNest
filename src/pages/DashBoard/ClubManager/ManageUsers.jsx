import { use, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { SummaryCard } from "../../../Components/SummaryCard";
import { DashboardLink } from "../../../Components/DashboardLink";

export const ManageUsers = () => {
  const { user } = use(AuthContext);
  const [token, setToken] = useState(null);

  // Async token fetch
  useEffect(() => {
    if (user) {
      user.getIdToken().then((idToken) => setToken(idToken));
    }
  }, [user]);

  const { data: summary = {}, isLoading } = useQuery({
    queryKey: ["manager-summary", user?.email],
    enabled: !!user?.email && !!token,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/manager/summary?email=${
          user.email
        }`,
        { headers: { authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
  });

  const {
    totalClubs = 0,
    totalMembers = 0,
    totalEvents = 0,
    totalPayments = 0,
  } = summary;

  if (isLoading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Club Manager Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <SummaryCard title="Total Clubs" value={totalClubs} />
        <SummaryCard title="Total Members" value={totalMembers} />
        <SummaryCard title="Total Events" value={totalEvents} />
        <SummaryCard title="Total Payments" value={totalPayments} />
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <DashboardLink
          title="My Clubs"
          description="View & edit your clubs"
          to="/dashboard/manager/my-clubs"
        />
        <DashboardLink
          title="Club Members"
          description="See members of your clubs"
          to="/dashboard/manager/club-members"
        />
        <DashboardLink
          title="Events Management"
          description="Manage events for your clubs"
          to="/dashboard/manager/events"
        />
        <DashboardLink
          title="Event Registrations"
          description="View registrations per event"
          to="/dashboard/manager/event-registrations"
        />
      </div>
    </div>
  );
};
