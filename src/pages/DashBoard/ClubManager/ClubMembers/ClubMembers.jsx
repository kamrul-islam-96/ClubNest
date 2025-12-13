import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";

export const ClubMembers = () => {
  const { user } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        setError("");

        const token = await user.getIdToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/memberships?managerEmail=${
            user.email
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setMembers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load members");
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [user?.email]);

  // 🔹 Group members by club
  const groupedMembers = members.reduce((acc, member) => {
    const clubName = member.clubName || "Unknown Club";
    if (!acc[clubName]) acc[clubName] = [];
    acc[clubName].push(member);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Club Members</h1>

      {/* Loading */}
      {loading && <p className="text-gray-500">Loading members...</p>}

      {/* Error */}
      {!loading && error && <p className="text-red-500 font-medium">{error}</p>}

      {/* Empty */}
      {!loading && !error && members.length === 0 && (
        <p className="text-gray-500">No members found for your clubs.</p>
      )}

      {/* Club Wise Members */}
      {!loading &&
        !error &&
        Object.keys(groupedMembers).map((clubName) => (
          <div
            key={clubName}
            className="bg-white p-6 rounded-xl shadow space-y-4"
          >
            <h2 className="text-xl font-semibold">
              {clubName}{" "}
              <span className="text-sm text-gray-500">
                ({groupedMembers[clubName].length} members)
              </span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th className="py-2 px-2 text-left">Member Email</th>
                    <th className="py-2 px-2 text-left">Status</th>
                    <th className="py-2 px-2 text-left">Joined At</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedMembers[clubName].map((m) => (
                    <tr key={m._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-2">{m.userEmail}</td>

                      <td className="py-2 px-2 capitalize">
                        {m.status === "active" ? (
                          <span className="text-green-600 font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="text-orange-500 font-medium">
                            Pending Payment
                          </span>
                        )}
                      </td>

                      <td className="py-2 px-2">
                        {m.joinedAt
                          ? new Date(m.joinedAt).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </div>
  );
};
