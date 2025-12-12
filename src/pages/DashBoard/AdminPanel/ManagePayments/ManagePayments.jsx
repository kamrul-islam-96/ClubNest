import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";
import { toast } from "react-hot-toast";

export const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const { user } = useContext(AuthContext); // যদি token user context থেকে আসে
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      // firebase token fetch
      const token = await user?.getIdToken();
      if (!token) throw new Error("User token not found");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch payments");
      }

      const data = await res.json();

      // Ensure data is always an array
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Network error");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Payments</h1>

      {loading ? (
        <p>Loading payments...</p>
      ) : payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3">User</th>
                <th>Club</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="py-3">{p.userEmail}</td>
                  <td>{p.clubName}</td>
                  <td>${p.amount}</td>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
