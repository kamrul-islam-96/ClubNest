import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

export const ManageClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  const fetchClubs = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return alert("Please login first");
      }

      const token = await user.getIdToken(); 

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/clubs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setClubs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const updateStatus = async (id, action) => {
    const user = auth.currentUser;
    if (!user) return alert("Not logged in");

    const token = await user.getIdToken();

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/clubs/${id}/${action}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchClubs();
  };

  if (loading) return <div className="p-10 text-center">Loading clubs...</div>;
  if (clubs.length === 0)
    return (
      <div className="p-10 text-center text-gray-500">
        No pending clubs found.
      </div>
    );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Manage Clubs</h1>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">Club Name</th>
              <th className="px-6 py-4 text-left">Manager</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clubs.map((club) => (
              <tr key={club._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-5 font-medium">{club.clubName}</td>
                <td className="px-6 py-5">{club.managerEmail}</td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    pending
                  </span>
                </td>
                <td className="px-6 py-5 text-right space-x-3">
                  <button
                    onClick={() => updateStatus(club._id, "approve")}
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(club._id, "reject")}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
