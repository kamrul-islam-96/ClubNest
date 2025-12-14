import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { use } from "react";

export const EventDetails = () => {
  const { id } = useParams();
  const { user } = use(AuthContext);

  const [event, setEvent] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [processing, setProcessing] = useState(false);

  // 🔐 Firebase token
  useEffect(() => {
    if (user) {
      user.getIdToken().then(setToken);
    }
  }, [user]);

  // 🎭 Fetch role directly
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/users/role`, {
          params: { email: user.email },
        })
        .then((res) => setRole(res.data.role))
        .catch(() => setRole(""));
    }
  }, [user]);

  // 📦 Fetch event
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/events/${id}`)
      .then((res) => setEvent(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    if (!user) return alert("Please login first");
    setProcessing(true);

    try {
      if (event.isPaid) {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/create-event-payment`,
          { eventId: event._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        window.location.href = res.data.sessionUrl;
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/event-registrations`,
          { eventId: event._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Successfully registered!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p className="p-10 text-center">Loading...</p>;
  if (!event) return <p className="p-10 text-center">Event not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold
              ${
                event.isPaid
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {event.isPaid ? `Paid $${event.eventFee}` : "Free"}
            </span>
          </div>
          <p className="mt-2 opacity-90">{event.clubName}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-gray-700">{event.description}</p>

          <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
            <p>
              📅 <strong>Date:</strong>{" "}
              {new Date(event.eventDate).toLocaleDateString()}
            </p>
            <p>
              📍 <strong>Location:</strong> {event.location}
            </p>
            <p>
              👥 <strong>Max:</strong> {event.maxAttendees || "Unlimited"}
            </p>
            <p>
              🧾 <strong>Registered:</strong> {event.registeredCount || 0}
            </p>
            <p className="text-xs text-gray-400">Role: {role}</p>
          </div>

          {/* ✅ Register Button (Assignment-11 Correct) */}
          {role === "member" && (
            <button
              onClick={handleRegister}
              disabled={processing}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold"
            >
              {processing
                ? "Processing..."
                : event.isPaid
                ? "Pay & Register"
                : "Register for Event"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
