import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../../context/AuthContext/AuthContext";

export const AllClubs = () => {
  const { user } = use(AuthContext);

  const { data: clubs = [], isLoading, error } = useQuery({
    queryKey: ["allClubs"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clubs`, {
        headers: user
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Failed to load clubs.</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-semibold mb-4">All Clubs</h2>

      {clubs.length === 0 ? (
        <p className="text-gray-500">No clubs available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <div
              key={club._id}
              className="bg-white shadow p-5 rounded-xl border space-y-3"
            >
              {club.bannerImage && (
                <img
                  src={club.bannerImage}
                  alt="club banner"
                  className="h-40 w-full object-cover rounded-lg"
                />
              )}
              <h3 className="text-xl font-bold">{club.clubName}</h3>
              <p className="text-gray-600">{club.description}</p>
              <p className="text-sm text-gray-500">
                Category: {club.category} | Location: {club.location}
              </p>
              {club.membershipFee > 0 ? (
                <p className="text-green-600 font-semibold">
                  Membership Fee: ${club.membershipFee}
                </p>
              ) : (
                <p className="text-blue-600 font-semibold">Free Membership</p>
              )}
              {/* Optional: Join / Details link */}
              <Link
                to={`/clubs/${club._id}`}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Club
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
