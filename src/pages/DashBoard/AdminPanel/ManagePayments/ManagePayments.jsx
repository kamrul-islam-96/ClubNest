import { useEffect, useState } from "react";

export const ManagePayments = () => {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments`);
    const data = await res.json();
    setPayments(data);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Payments</h1>

      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <table className="w-full">
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
    </div>
  );
};
