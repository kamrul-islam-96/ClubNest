import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import axios from "axios";

export const MemberDashboard = () => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState({});
  const [myClubs, setMyClubs] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const token = await user.getIdToken();
        const api = axios.create({
          baseURL: import.meta.env.VITE_API_URL,
          headers: { Authorization: `Bearer ${token}` },
        });

        // summary
        const summaryRes = await api.get(
          `/api/member/summary?email=${user.email}`
        );
        setSummary(summaryRes.data);

        // my clubs
        const clubsRes = await api.get(`/api/member/clubs?email=${user.email}`);
        setMyClubs(clubsRes.data);

        // payments
        const paymentsRes = await api.get(
          `/api/member/payments?email=${user.email}`
        );
        setPayments(paymentsRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="pl-6 pr-4 space-y-8">
      <h1 className="text-3xl font-bold">
        Welcome, {user?.displayName || "Member"}
      </h1>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Clubs Joined</p>
          <p className="text-3xl font-bold">{summary.clubsJoined || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Events Registered</p>
          <p className="text-3xl font-bold">{summary.eventsRegistered || 0}</p>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        <p className="text-gray-500">Events module is coming soon 🚧</p>
      </div>

      {/* My Clubs */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">My Clubs</h2>
        <div className="grid md:grid-cols-3 grid-cols-2 gap-6">
          {myClubs.map((club) => (
            <div key={club.id} className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold">{club.name}</h3>
              <p>{club.location}</p>
              <p>Status: {club.membershipStatus}</p>
              <p>Expiry: {club.expiryDate}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="p-0">
        <h2 className="text-2xl font-semibold mb-6">Payment History</h2>
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-linear-to-r from-blue-500 to-indigo-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Club
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((p, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                    ${p.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {p.club}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(p.date).toLocaleDateString()}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap font-semibold ${
                      p.status === "Paid"
                        ? "text-green-600"
                        : p.status === "Free"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {p.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
