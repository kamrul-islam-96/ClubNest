import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { use, useState } from "react";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

// Paid membership payment form component
const CheckoutForm = ({ club, user, onPaymentSuccess,membershipId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create payment intent
      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: club.membershipFee * 100,
            currency: "usd",
            userEmail: user.email,
            clubId: club._id,
          }),
        }
      );

      const { clientSecret } = await res.json();

      // Confirm card payment
      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { email: user.email },
          },
        }
      );

      if (error) throw new Error(error.message);

      // Confirm membership in backend
      const confirmRes = await fetch(
        `${import.meta.env.VITE_API_URL}/memberships/${membershipId}/confirm`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentId: paymentIntent.id }),
        }
      );

      const confirmData = await confirmRes.json();
      if (!confirmRes.ok)
        throw new Error(confirmData.message || "Payment failed");

      toast.success("Joined Successfully");
      onPaymentSuccess();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-2 border rounded" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay $${club.membershipFee} & Join`}
      </button>
    </form>
  );
};

export const ClubDetails = () => {
  const { id } = useParams();
  const { user } = use(AuthContext);
  const queryClient = useQueryClient();
  const [joined, setJoined] = useState(false);
  const [membershipId, setMembershipId] = useState(null);


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

  // Free membership mutation
  const joinMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Please login first");

      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/memberships`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userEmail: user.email,
          clubId: club._id,
        }),
      });

      const data = await res.json();
      setMembershipId(data.membershipId)
      if (!res.ok) throw new Error(data.message || "Failed to join club");
      return data;
    },
    onSuccess: () => {
      toast.success("Club Joined Successfully");
      queryClient.invalidateQueries(["clubDetails", id]);
      setJoined(true);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );

  if (error || !club._id)
    return (
      <p className="text-red-500 text-center mt-6">
        Failed to load club details.
      </p>
    );

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
        {club.membershipFee > 0 ? (
          <p className="text-green-600 font-semibold text-lg">
            Membership Fee: ${club.membershipFee}
          </p>
        ) : (
          <p className="text-blue-600 font-semibold text-lg">Free Membership</p>
        )}
      </div>

      {/* Manager Info */}
      <div className="p-4 bg-gray-50 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold mb-1">Club Manager</h3>
        <p>Name: {club.managerName || "Unknown"}</p>
        <p>Email: {club.managerEmail || "Not Available"}</p>
      </div>

      {/* Join Button or Payment */}
      <div>
        {!joined && user && club.membershipFee === 0 && (
          <button
            onClick={() => joinMutation.mutate()}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Join Club
          </button>
        )}

        {!joined && user && club.membershipFee > 0 && (
          <Elements stripe={stripePromise}>
            <CheckoutForm
              club={club}
              user={user}
              membershipId={membershipId} 
              onPaymentSuccess={() => setJoined(true)}
            />
          </Elements>
        )}

        {!user && (
          <p className="text-red-500">Please login to join this club.</p>
        )}

        {joined && (
          <p className="text-green-600 font-semibold mt-2">
            You have joined this club!
          </p>
        )}
      </div>
    </div>
  );
};
