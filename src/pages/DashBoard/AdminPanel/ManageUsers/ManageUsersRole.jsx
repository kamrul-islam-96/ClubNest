import { useEffect, useState } from "react";

export const ManageUsersRole = () => {
  const [users, setUsers] = useState([]);

  // Fetch all users
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:3000/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update Role
  const handleRoleUpdate = async (email, newRole) => {
    const token = localStorage.getItem("firebaseToken");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify({ email, newRole }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Role Updated Successfully!");
      fetchUsers();
    } else {
      alert(data.message);
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
            {users.map((user) => (
              <tr key={user.uid} className="border-b">
                <td className="py-3">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm">
                    {user.role}
                  </span>
                </td>

                <td className="text-right space-x-2">
                  <button
                    onClick={() => handleRoleUpdate(user.email, "admin")}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg"
                  >
                    Make Admin
                  </button>

                  <button
                    onClick={() => handleRoleUpdate(user.email, "clubManager")}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg"
                  >
                    Club Manager
                  </button>

                  <button
                    onClick={() => handleRoleUpdate(user.email, "member")}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                  >
                    Member
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
