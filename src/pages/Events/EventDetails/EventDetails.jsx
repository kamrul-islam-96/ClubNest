// pages/EventDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { EventCheckoutForm } from "../../../Components/EventCheckOutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

// Main EventDetails Component
export const EventDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [registrationId, setRegistrationId] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState("");

  // Fetch event details with club info
  const {
    data: event = {},
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["eventDetails", id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/events/${id}`);
      if (!res.ok) throw new Error("Failed to fetch event");
      return res.json();
    },
  });

  // Check if user already registered
  useEffect(() => {
    const checkRegistration = async () => {
      if (user && event?._id) {
        try {
          const token = await user.getIdToken();
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/check-event-registration?eventId=${
              event._id
            }`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (res.ok) {
            const data = await res.json();
            console.log("Registration check data:", data);

            setIsRegistered(data.isRegistered);
            setRegistrationStatus(data.status);

            if (data.registrationId) {
              setRegistrationId(data.registrationId);
            }

            // If pending payment, show payment form directly
            if (data.status === "pendingPayment") {
              setShowPayment(true);
            }
          }
        } catch (err) {
          console.error("Check registration error:", err);
        }
      }
    };
    if (event?._id) checkRegistration();
  }, [event?._id, user]);

  // Handle registration (both free and paid)
  const handleRegistration = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      const token = await user.getIdToken();

      // Call registration endpoint
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/event-registrations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId: event._id }),
        }
      );

      const data = await res.json();
      console.log("Registration response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Handle response
      if (data.existing && data.status === "pendingPayment") {
        // Existing pending payment
        setRegistrationId(data.registrationId);
        setShowPayment(true);
        setRegistrationStatus("pendingPayment");
        toast.success("Continue with your pending payment");
      } else if (data.requiresPayment) {
        // New paid registration
        setRegistrationId(data.registrationId);
        setShowPayment(true);
        setRegistrationStatus("pendingPayment");
        toast.success("Registration created! Please complete payment.");
      } else {
        // Free registration or already registered
        setIsRegistered(true);
        setRegistrationId(data.registrationId);
        setRegistrationStatus("registered");
        toast.success("Successfully registered for event!");
        refetch();
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.message);
    }
  };

  // Cancel payment attempt
  const handleCancelPayment = () => {
    setShowPayment(false);
    toast.info("Payment cancelled");
  };

  const handlePaymentSuccess = () => {
    setIsRegistered(true);
    setShowPayment(false);
    setRegistrationStatus("registered");
    toast.success("Payment successful! You are now registered.");
    refetch();
  };

  // Calculate available seats
  const availableSeats = event.maxAttendees
    ? Math.max(0, event.maxAttendees - (event.registeredCount || 0))
    : null;

  const isFull = event.maxAttendees && availableSeats <= 0;

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        <p className="text-lg font-semibold">Failed to load event</p>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold">{event.title}</h1>
              <p className="mt-2 opacity-90">{event.clubName}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-4 py-1.5 rounded-full font-semibold ${
                  event.isPaid
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {event.isPaid ? `$${event.eventFee}` : "Free"}
              </span>
              {isFull && (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  Sold Out
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-gray-700 leading-relaxed">{event.description}</p>

          {/* Event Details */}
          <div className="grid sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-600" />
              <div>
                <p className="font-medium">Date & Time</p>
                <p className="text-gray-600">
                  {new Date(event.eventDate).toLocaleDateString()} at{" "}
                  {new Date(event.eventDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-blue-600" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-gray-600">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="text-blue-600" />
              <div>
                <p className="font-medium">Attendees</p>
                <p className="text-gray-600">
                  {event.registeredCount || 0}
                  {event.maxAttendees ? ` / ${event.maxAttendees}` : ""}
                  {availableSeats !== null && ` (${availableSeats} seats left)`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="text-blue-600" />
              <div>
                <p className="font-medium">Payment</p>
                <p className="text-gray-600">
                  {event.isPaid ? `Paid - $${event.eventFee}` : "Free Entry"}
                </p>
              </div>
            </div>
          </div>

          {/* Registration Status */}
          {user && registrationStatus && (
            <div
              className={`p-4 rounded-xl flex items-start gap-3 ${
                registrationStatus === "registered"
                  ? "bg-green-50 border border-green-200"
                  : registrationStatus === "pendingPayment"
                  ? "bg-yellow-50 border border-yellow-200"
                  : ""
              }`}
            >
              {registrationStatus === "registered" ? (
                <CheckCircle className="text-green-600 mt-1" />
              ) : (
                <AlertCircle className="text-yellow-600 mt-1" />
              )}
              <div>
                <p
                  className={`font-semibold ${
                    registrationStatus === "registered"
                      ? "text-green-700"
                      : "text-yellow-700"
                  }`}
                >
                  {registrationStatus === "registered"
                    ? "You are registered for this event!"
                    : "Payment Pending"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {registrationStatus === "registered"
                    ? `Registration ID: ${registrationId}`
                    : `Complete payment to confirm your registration (ID: ${registrationId})`}
                </p>
              </div>
            </div>
          )}

          {/* Registration Section */}
          <div className="mt-8">
            {!user ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-yellow-700 font-medium">
                  Please login to register for this event
                </p>
              </div>
            ) : registrationStatus === "registered" ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="font-semibold text-green-700">
                  ✅ You are already registered for this event!
                </p>
              </div>
            ) : isFull ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 font-medium">
                  This event is fully booked
                </p>
              </div>
            ) : event.isPaid && showPayment ? (
              <Elements stripe={stripePromise}>
                <EventCheckoutForm
                  event={event}
                  user={user}
                  registrationId={registrationId}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handleCancelPayment}
                />
              </Elements>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleRegistration}
                  disabled={isLoading}
                  className={`w-full py-3 rounded-xl font-bold text-lg ${
                    event.isPaid
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {registrationStatus === "pendingPayment"
                    ? "Continue Payment"
                    : event.isPaid
                    ? "Register & Pay"
                    : "Register for Free"}
                </button>

                {event.isPaid && registrationStatus !== "pendingPayment" && (
                  <p className="text-sm text-center text-gray-500">
                    You'll complete payment after registration
                  </p>
                )}

                {registrationStatus === "pendingPayment" && (
                  <p className="text-sm text-center text-yellow-600">
                    You have a pending payment for this event
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
