import { useState, useContext } from "react";
import { NavLink } from "react-router";
import { AuthContext } from "../../../context/AuthContext/AuthContext";

// Helper components
const SummaryCard = ({ title, value }) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl shadow flex flex-col items-start sm:items-center">
    <span className="text-gray-500 text-sm sm:text-base">{title}</span>
    <span className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{value}</span>
  </div>
);

const ClubCard = ({ club }) => (
  <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-2 hover:shadow-md transition">
    <h3 className="font-semibold text-lg sm:text-xl">{club.name}</h3>
    <p className="text-sm sm:text-base">{club.location}</p>
    <p className="text-sm sm:text-base">Status: {club.membershipStatus}</p>
    <p className="text-sm sm:text-base">Expiry: {club.expiryDate}</p>
    <NavLink
      to={`/clubs/${club.id}`}
      className="mt-2 text-blue-600 text-sm sm:text-base hover:underline"
    >
      View Details
    </NavLink>
  </div>
);

const EventRow = ({ event }) => (
  <tr className="border-b hover:bg-gray-50">
    <td className="px-2 sm:px-4 py-2 text-sm sm:text-base">{event.title}</td>
    <td className="px-2 sm:px-4 py-2 text-sm sm:text-base">{event.clubName}</td>
    <td className="px-2 sm:px-4 py-2 text-sm sm:text-base">{event.date}</td>
    <td className="px-2 sm:px-4 py-2 text-sm sm:text-base">{event.status}</td>
  </tr>
);

export const MemberDashboard = () => {
  const { user } = useContext(AuthContext);

  // Placeholder data
  const [summary] = useState({ clubsJoined: 3, eventsRegistered: 5 });
  const [myClubs] = useState([
    {
      id: 1,
      name: "Chess Club",
      location: "Building A",
      membershipStatus: "Active",
      expiryDate: "2025-06-30",
    },
    {
      id: 2,
      name: "Music Club",
      location: "Building B",
      membershipStatus: "Active",
      expiryDate: "2025-07-15",
    },
  ]);
  const [myEvents] = useState([
    {
      title: "Chess Tournament",
      clubName: "Chess Club",
      date: "2025-12-20",
      status: "Registered",
    },
    {
      title: "Music Concert",
      clubName: "Music Club",
      date: "2025-12-25",
      status: "Registered",
    },
  ]);
  const [payments] = useState([
    {
      amount: 50,
      type: "Membership",
      club: "Chess Club",
      date: "2025-11-01",
      status: "Paid",
    },
    {
      amount: 30,
      type: "Membership",
      club: "Music Club",
      date: "2025-11-15",
      status: "Paid",
    },
  ]);

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* Welcome */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
        Welcome, {user?.displayName || "Member"}!
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <SummaryCard title="Clubs Joined" value={summary.clubsJoined} />
        <SummaryCard
          title="Events Registered"
          value={summary.eventsRegistered}
        />
      </div>

      {/* Upcoming Events */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Upcoming Events
        </h2>
        <p className="text-sm sm:text-base text-gray-500">
          This section will show upcoming events from your clubs.
        </p>
      </div>

      {/* My Clubs */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">My Clubs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {myClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </div>

      {/* My Events */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">My Events</h2>
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left text-sm sm:text-base">
                  Event
                </th>
                <th className="px-2 sm:px-4 py-2 text-left text-sm sm:text-base">
                  Club
                </th>
                <th className="px-2 sm:px-4 py-2 text-left text-sm sm:text-base">
                  Date
                </th>
                <th className="px-2 sm:px-4 py-2 text-left text-sm sm:text-base">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {myEvents.map((event, idx) => (
                <EventRow key={idx} event={event} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Payment History</h2>
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left text-sm sm:text-base">
                  Amount
                </th>
                <th className="px-2 sm:px-4 py-2 text-left text-sm sm:text-base">
                  Type
                </th>
                <th className="px-2 sm:px-4 py-2 text-left text-sm sm:text-base">
                  Club
                </th>
                <th className="px-2 sm:px-4 py-2 text-left text-sm sm:text-base">
                  Date
                </th>
                <th className="px-2 sm:px-4 py-2 text-left text-sm sm:text-base">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((pay, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-2 sm:px-4 py-2">${pay.amount}</td>
                  <td className="px-2 sm:px-4 py-2">{pay.type}</td>
                  <td className="px-2 sm:px-4 py-2">{pay.club}</td>
                  <td className="px-2 sm:px-4 py-2">{pay.date}</td>
                  <td className="px-2 sm:px-4 py-2">{pay.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
