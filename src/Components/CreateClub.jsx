import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { use } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";

export const CreateClub = () => {
  const { user } = use(AuthContext);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // POST API call to create club
  const createClubMutation = useMutation({
    mutationFn: async (data) => {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clubs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          managerEmail: user.email,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success("Club created successfully");
      queryClient.invalidateQueries(["myClubs"]);
    },
    onError: () => {
      toast.error("Failed to create club");
    },
  });

  const onSubmit = (data) => {
    createClubMutation.mutate(data);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create New Club</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("clubName", { required: "Club name required" })}
          placeholder="Club Name"
          className="input input-bordered w-full"
        />
        {errors.clubName && (
          <p className="text-red-500">{errors.clubName.message}</p>
        )}

        <textarea
          {...register("description", { required: "Description required" })}
          placeholder="Description"
          className="textarea textarea-bordered w-full"
        />

        <input
          {...register("location", { required: "Location required" })}
          placeholder="Location"
          className="input input-bordered w-full"
        />

        <input
          type="number"
          {...register("membershipFee", { required: true, min: 0 })}
          placeholder="Membership Fee (0 for free)"
          className="input input-bordered w-full"
        />

        <input
          {...register("category", { required: "Category required" })}
          placeholder="Category (e.g., Photography, Sports)"
          className="input input-bordered w-full"
        />

        <input
          {...register("bannerImage", {
            required: "Banner image URL required",
          })}
          placeholder="Banner Image URL"
          className="input input-bordered w-full"
        />

        <button type="submit" className="btn btn-primary">
          Create Club
        </button>
      </form>
    </div>
  );
};
