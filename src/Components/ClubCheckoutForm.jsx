import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import { Loader2, CreditCard, CheckCircle, XCircle } from "lucide-react";

export const ClubCheckoutForm = ({
  club,
  user,
  membershipId,
  onPaymentSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setCardError("");

    try {
      const token = await user.getIdToken();

      // Create Payment Intent in backend
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: Math.round(club.membershipFee * 100),
            currency: "usd",
            userEmail: user.email,
            clubId: club._id,
            membershipId: membershipId,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Payment setup failed");
      }

      const { clientSecret } = await res.json();

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: user.email,
              name: user.displayName || user.email,
            },
          },
        }
      );

      if (error) {
        setCardError(error.message);
        throw new Error(error.message);
      }

      // Confirm membership
      const confirmRes = await fetch(
        `${import.meta.env.VITE_API_URL}/memberships/${membershipId}/confirm`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentId: paymentIntent.id,
            status: "active",
          }),
        }
      );

      const confirmData = await confirmRes.json();
      if (!confirmRes.ok) {
        throw new Error(confirmData.message || "Membership activation failed");
      }

      toast.success("Payment successful! Welcome to the club!");
      onPaymentSuccess();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-6 border rounded-xl bg-white shadow">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold">Complete Payment</h3>
          </div>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
            Pending
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-gray-600">
            Club: <span className="font-medium">{club.clubName}</span>
          </p>
          <p className="text-lg font-bold text-green-700">
            Amount: ${club.membershipFee}
          </p>
          <p className="text-sm text-gray-500">
            Membership ID: <span className="font-mono">{membershipId}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Card Details</label>
          <CardElement
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": { color: "#aab7c4" },
                },
              },
            }}
          />
          {cardError && (
            <div className="flex items-center gap-2 mt-1 text-red-500 text-sm">
              <XCircle className="w-4 h-4" />
              {cardError}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Pay ${club.membershipFee} & Join Club
            </>
          )}
        </button>
      </form>
    </div>
  );
};
