import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { AuthContext } from "../../../context/AuthContext/AuthContext";

export const ClubDetails = () => {
  const { id } = useParams();
  const { user } = use(AuthContext);

  const {
    data: club = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["clubDetails", id],
    queryFn: async () => {
      const token = user ? await user.getIdToken() : null;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/clubs/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) throw new Error("Failed to fetch data");
      return res.json();
    },
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  // Error State
  if (error || !club._id) {
    return (
      <p className="text-red-500 text-center mt-6">
        Failed to load club details.
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Banner Image */}
      {club.bannerImage && (
        <img
          src={club.bannerImage}
          alt="club banner"
          className="w-full h-64 object-cover rounded-xl shadow"
        />
      )}

      {/* Club Info */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{club.clubName}</h1>
        <p className="text-gray-600">{club.description}</p>

        <div className="flex gap-4 text-sm text-gray-500 flex-wrap">
          <span>📂 Category: {club.category}</span>
          <span>📍 Location: {club.location}</span>
          <span>👥 Members: {club.membersCount || 0}</span>
        </div>

        {/* Membership Fee */}
        {club.membershipFee > 0 ? (
          <p className="text-green-600 font-semibold text-lg">
            Membership Fee: ${club.membershipFee}
          </p>
        ) : (
          <p className="text-blue-600 font-semibold text-lg">
            Free Membership
          </p>
        )}
      </div>

      {/* Manager Info */}
      <div className="p-4 bg-gray-50 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold mb-1">Club Manager</h3>
        <p>Name: {club.managerName || "Unknown"}</p>
        <p>Email: {club.managerEmail || "Not Available"}</p>
      </div>

      {/* Join Button */}
      <div>
        <Link
          to={`/clubs/${id}/join`}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Join Club
        </Link>
      </div>
    </div>
  );
};
