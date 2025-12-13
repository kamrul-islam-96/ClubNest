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

  // সব user fetch করা
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

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((userRow) => {
              const isSelf = userRow.email === user?.email;

              return (
                <tr key={userRow.uid} className="border-b">
                  <td className="py-3">{userRow.name}</td>
                  <td>{userRow.email}</td>
                  <td>
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm">
                      {userRow.role}
                    </span>
                  </td>
                  <td className="text-right space-x-2">
                    <button
                      onClick={() => handleRoleUpdate(userRow.email, "admin")}
                      disabled={userRole !== "admin" || isSelf}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg disabled:opacity-50"
                    >
                      Make Admin
                    </button>

                    <button
                      onClick={() =>
                        handleRoleUpdate(userRow.email, "clubManager")
                      }
                      disabled={userRole !== "admin" || isSelf}
                      className="px-3 py-1 bg-purple-600 text-white rounded-lg disabled:opacity-50"
                    >
                      Club Manager
                    </button>

                    <button
                      onClick={() => handleRoleUpdate(userRow.email, "member")}
                      disabled={userRole !== "admin" || isSelf}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                    >
                      Member
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
