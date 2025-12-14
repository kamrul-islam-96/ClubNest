import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";

export const MyClubs = () => {
  const { user } = use(AuthContext);

  // Fetch clubs managed by logged in manager
  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["myClubs", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/clubs?managerEmail=${user.email}`
      );
      return res.json();
    },
    enabled: !!user?.email,
  });

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      );
    }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold">My Clubs</h2>

        {/* Create New Club */}
        <Link
          to="/dashboard/manager/create-club"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create Club
        </Link>
      </div>

      {/* List of clubs */}
      {clubs.length === 0 ? (
        <p className="text-gray-500">You have not created any clubs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clubs.map((club) => (
            <div
              key={club._id}
              className="bg-white shadow p-5 rounded-xl border space-y-3"
            >
              <img
                src={club.bannerImage}
                alt="club banner"
                className="h-40 w-full object-cover rounded-lg"
              />
              <h3 className="text-xl font-bold">{club.clubName}</h3>
              <p className="text-gray-600">{club.description}</p>

              <div className="flex justify-between items-center pt-3">
                <Link
                  to={`/dashboard/manager/edit-club/${club._id}`}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  Edit
                </Link>

                <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
