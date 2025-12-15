import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { use } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";
import Swal from "sweetalert2";

export const MyClubs = () => {
  const { user } = use(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch clubs managed by logged in manager
  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["myClubs", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/clubs?managerEmail=${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        }
      );
      return res.json();
    },
    enabled: !!user?.email,
  });

  // Delete Club Mutation
  const deleteMutation = useMutation({
    mutationFn: async (clubId) => {
      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/clubs/${clubId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete club");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myClubs", user?.email]);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Club has been deleted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to delete club",
      });
    },
  });

  // Handle Delete Confirmation
  const handleDelete = (clubId, clubName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to delete "${clubName}"? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(clubId);
      }
    });
  };

  // Handle Edit
  const handleEdit = (clubId) => {
    navigate(`/dashboard/manager/edit-club/${clubId}`);
  };

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
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">
            You have not created any clubs yet.
          </p>
          <Link
            to="/dashboard/manager/create-club"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Create Your First Club
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <div
              key={club._id}
              className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 p-5 rounded-xl border space-y-4"
            >
              {/* Club Banner */}
              {club.bannerImage ? (
                <img
                  src={club.bannerImage}
                  alt={club.clubName}
                  className="h-48 w-full object-cover rounded-lg"
                />
              ) : (
                <div className="h-48 w-full bg-linear-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-4xl">🏢</span>
                </div>
              )}

              {/* Club Info */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 truncate">
                  {club.clubName}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {club.description}
                </p>

                {/* Club Details */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📍</span>
                    <span>{club.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">🏷️</span>
                    <span>{club.category}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">💰</span>
                    <span>Fee: ${club.membershipFee || 0}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        club.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : club.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {club.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <button
                  onClick={() => handleEdit(club._id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                >
                  <span>✏️</span>
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(club._id, club.clubName)}
                  disabled={deleteMutation.isLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteMutation.isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <span>🗑️</span>
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
