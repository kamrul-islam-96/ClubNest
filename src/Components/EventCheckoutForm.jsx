// components/EventCheckoutForm.jsx - UPDATED
import { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";

export const EventCheckoutForm = ({
  event,
  user,
  registrationId,
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState("");
  const [isFreeEvent, setIsFreeEvent] = useState(false);

  useEffect(() => {
    // Check if event is actually free
    const eventFee = Number(event.eventFee) || 0;
    const freeEvent = !event.isPaid || eventFee === 0;
    setIsFreeEvent(freeEvent);

    if (freeEvent) {
      // If free event, automatically register
      handleFreeRegistration();
    }
  }, [event]);

  const handleFreeRegistration = async () => {
    if (!user || !registrationId) return;

    setLoading(true);
    try {
      const token = await user.getIdToken();

      // Confirm free registration
      const confirmRes = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/event-registrations/${registrationId}/confirm`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentId: "free_registration" }),
        }
      );

      if (!confirmRes.ok) {
        const error = await confirmRes.json();
        throw new Error(error.message || "Registration failed");
      }

      toast.success("🎉 Successfully registered for free event!");
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      console.error("Free registration error:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaidPayment = async (e) => {
    e.preventDefault();
    if (loading || !stripe || !elements) return;

    setLoading(true);
    setCardError("");

    try {
      const token = await user.getIdToken();

      // Create payment intent
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/create-event-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId: event._id }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Payment setup failed");
      }

      const { clientSecret } = await res.json();

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Confirm payment
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

      // Confirm registration
      const confirmRes = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/event-registrations/${registrationId}/confirm`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentId: paymentIntent.id }),
        }
      );

      if (!confirmRes.ok) {
        const error = await confirmRes.json();
        throw new Error(error.message || "Registration confirmation failed");
      }

      toast.success("Payment successful! Event registration confirmed.");
      onSuccess();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // If free event, show success message
  if (isFreeEvent) {
    return (
      <div className="mt-6 p-6 border rounded-xl bg-white shadow">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-emerald-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-emerald-700">
            Free Registration
          </h3>
          <p className="text-gray-600 mb-4">
            This event is free to attend. No payment required.
          </p>

          {loading ? (
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing registration...</span>
            </div>
          ) : (
            <button
              onClick={() => navigate(`/events/${event._id}`)}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Back to Event
            </button>
          )}
        </div>
      </div>
    );
  }

  // Paid event - show payment form
  return (
    <div className="mt-6 p-6 border rounded-xl bg-white shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Complete Payment</h3>
        <p className="text-gray-600">Amount: ${event.eventFee}</p>
        <p className="text-sm text-gray-500 mt-1">
          Registration ID: {registrationId}
        </p>
      </div>

      <form onSubmit={handlePaidPayment} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Card Details</label>
          <CardElement
            className="p-3 border rounded-lg"
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
            <p className="text-red-500 text-sm mt-1">{cardError}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!stripe || loading}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay $${event.eventFee}`
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="mt-4 p-3 bg-yellow-50 text-sm rounded-lg">
        <p className="font-medium">💳 Test Card:</p>
        <p className="text-gray-600">
          Use: <strong>4242 4242 4242 4242</strong>, any future date, any CVC
        </p>
      </div>
    </div>
  );
};
