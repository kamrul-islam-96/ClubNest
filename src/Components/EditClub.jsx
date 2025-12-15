import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { use } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext/AuthContext";

export const EditClub = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = use(AuthContext);
  const [formData, setFormData] = useState({
    clubName: "",
    description: "",
    category: "",
    location: "",
    bannerImage: "",
    membershipFee: 0,
  });

  const categories = [
    "Technology",
    "Sports",
    "Arts",
    "Music",
    "Business",
    "Science",
    "Health",
    "Social",
    "Academic",
    "Other",
  ];

  // Fetch club details
  const { data: club, isLoading } = useQuery({
    queryKey: ["club", id],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clubs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.json();
    },
    enabled: !!id && !!user,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clubs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Update failed");
      }
      return res.json();
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Club updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/dashboard/manager/my-clubs");
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    },
  });

  // Set form data when club is loaded
  useEffect(() => {
    if (club) {
      setFormData({
        clubName: club.clubName || "",
        description: club.description || "",
        category: club.category || "",
        location: club.location || "",
        bannerImage: club.bannerImage || "",
        membershipFee: club.membershipFee || 0,
      });
    }
  }, [club]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "membershipFee" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.clubName.trim() || !formData.description.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Club name and description are required",
      });
      return;
    }

    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Edit Club</h2>
        <p className="text-gray-600 mt-2">Update your club information</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 space-y-6"
      >
        {/* Club Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Club Name *
          </label>
          <input
            type="text"
            name="clubName"
            value={formData.clubName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter club name"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your club..."
            required
          />
        </div>

        {/* Category and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="City, Country"
              required
            />
          </div>
        </div>

        {/* Banner Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Image URL
          </label>
          <input
            type="url"
            name="bannerImage"
            value={formData.bannerImage}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
          {formData.bannerImage && (
            <div className="mt-3">
              <img
                src={formData.bannerImage}
                alt="Preview"
                className="h-40 w-full object-cover rounded-lg border"
              />
            </div>
          )}
        </div>

        {/* Membership Fee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Membership Fee (USD)
          </label>
          <input
            type="number"
            name="membershipFee"
            value={formData.membershipFee}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
          <p className="text-sm text-gray-500 mt-2">
            Set to 0 for free membership
          </p>
        </div>

        {/* Status Display (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div
            className={`px-4 py-2 rounded-lg inline-block ${
              club?.status === "approved"
                ? "bg-green-100 text-green-800"
                : club?.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {club?.status?.toUpperCase()}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Status cannot be changed. Contact admin for status updates.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard/manager/my-clubs")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateMutation.isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateMutation.isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Updating...
              </>
            ) : (
              "Update Club"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
