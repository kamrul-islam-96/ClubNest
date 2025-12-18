import { useEffect, useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";

export const ManageUsersRole = () => {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState("");

  // Logged-in user's role fetch করা
  const fetchUserRole = async () => {
    if (!user?.email) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/role?email=${user.email}`
      );
      const data = await res.json();
      setUserRole(data.role);
    } catch (err) {
      console.error("Failed to fetch user role", err);
    }
  };

  // fetch all data
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to fetch users");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserRole();
    fetchUsers();
  }, [user?.email]);

  // Role update handler
  const handleRoleUpdate = async (email, newRole) => {
    if (!userRole || userRole !== "admin") {
      toast.error("Only Admins can change role");
      return;
    }

    if (email === user?.email && newRole !== "admin") {
      toast.error("Admin can not change his role");
      return;
    }

    try {
      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, newRole }),
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success(`Role updated to ${newRole}`);
        fetchUsers();
      } else {
        toast.error(data.message || "Role update failed");
      }
    } catch (err) {
      toast.error(err.message || "Network error");
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop View: Table (Hidden on Mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">User Information</th>
                <th className="px-6 py-4 font-semibold">Current Role</th>
                <th className="px-6 py-4 text-right font-semibold">
                  Manage Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((userRow) => {
                const isSelf = userRow.email === user?.email;
                return (
                  <tr
                    key={userRow.uid}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {userRow.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {userRow.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                        {userRow.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            handleRoleUpdate(userRow.email, "admin")
                          }
                          disabled={userRole !== "admin" || isSelf}
                          className="px-3 py-1.5 text-xs font-medium bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-30 transition-all"
                        >
                          Admin
                        </button>
                        <button
                          onClick={() =>
                            handleRoleUpdate(userRow.email, "clubManager")
                          }
                          disabled={userRole !== "admin" || isSelf}
                          className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-30 transition-all"
                        >
                          Manager
                        </button>
                        <button
                          onClick={() =>
                            handleRoleUpdate(userRow.email, "member")
                          }
                          disabled={userRole !== "admin" || isSelf}
                          className="px-3 py-1.5 text-xs font-medium bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all"
                        >
                          Member
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards (Hidden on Desktop) */}
        <div className="md:hidden divide-y divide-gray-100">
          {users.map((userRow) => {
            const isSelf = userRow.email === user?.email;
            return (
              <div key={userRow.uid} className="p-5 space-y-4 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900">{userRow.name}</h4>
                    <p className="text-sm text-gray-500 lowercase">
                      {userRow.email}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                    {userRow.role}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <button
                    onClick={() => handleRoleUpdate(userRow.email, "admin")}
                    disabled={userRole !== "admin" || isSelf}
                    className="py-2.5 text-[11px] font-bold bg-slate-800 text-white rounded-xl active:scale-95 disabled:opacity-30 transition-all"
                  >
                    ADMIN
                  </button>
                  <button
                    onClick={() =>
                      handleRoleUpdate(userRow.email, "clubManager")
                    }
                    disabled={userRole !== "admin" || isSelf}
                    className="py-2.5 text-[11px] font-bold bg-indigo-600 text-white rounded-xl active:scale-95 disabled:opacity-30 transition-all"
                  >
                    MANAGER
                  </button>
                  <button
                    onClick={() => handleRoleUpdate(userRow.email, "member")}
                    disabled={userRole !== "admin" || isSelf}
                    className="py-2.5 text-[11px] font-bold bg-gray-100 text-gray-700 rounded-xl active:scale-95 disabled:opacity-30 transition-all"
                  >
                    MEMBER
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
