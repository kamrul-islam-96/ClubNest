import { use, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";

export const EventsManagement = () => {
  const { user } = use(AuthContext);
  const [token, setToken] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  // Get Firebase token
  useEffect(() => {
    if (user) {
      user.getIdToken().then((idToken) => setToken(idToken));
    }
  }, [user]);

  // Fetch manager's events
  const fetchEvents = () => {
    if (token) {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/events/manager`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setEvents(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
          setMessage({ type: "error", text: "Failed to load events" });
        });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  // Handle Delete Event
  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${eventTitle}"?\n\nThis will also delete all registrations for this event.`
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/events/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: `Event "${eventTitle}" deleted successfully!`,
        });
        // Refresh events list
        fetchEvents();
      } else {
        throw new Error(response.data.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to delete event",
      });
    } finally {
      setLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  // Handle Update Event
  const handleUpdateEvent = (eventId) => {
    navigate(`/dashboard/manager/edit-event/${eventId}`);
  };

  // Handle View Event
  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header + Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Events</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage all your club events from here
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/manager/create-event")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer flex items-center gap-2"
          disabled={loading}
        >
          <span>+</span>
          Create Event
        </button>
      </div>

      {/* Message Display */}
      {message.text && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Loading State */}
      {loading && events.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 && !loading && (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 text-lg">No events created yet.</p>
            <button
              onClick={() => navigate("/dashboard/manager/create-event")}
              className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Create Your First Event
            </button>
          </div>
        )}

        {events.map((ev) => (
          <div
            key={ev._id}
            className="border rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col justify-between bg-white"
          >
            {/* Event Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-xl font-bold text-gray-800 truncate">
                  {ev.title}
                </h2>
                {/* Club Name */}
                <p className="text-sm text-gray-500 mt-1 truncate">
                  Club: {ev.clubName}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {ev.isPaid ? (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                    Paid: ${ev.eventFee}
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                    Free
                  </span>
                )}
                {/* Registered Count Badge */}
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                  {ev.registeredUsersCount || 0} Registered
                </span>
              </div>
            </div>

            {/* Event Description */}
            {ev.description && (
              <p className="text-gray-600 mb-3 line-clamp-3 text-sm">
                {ev.description}
              </p>
            )}

            {/* Event Details */}
            <div className="text-gray-700 mb-3 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📅</span>
                <span>{new Date(ev.eventDate).toLocaleDateString()}</span>
                <span className="text-gray-400">
                  {new Date(ev.eventDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {ev.location && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📍</span>
                  <span className="truncate">{ev.location}</span>
                </div>
              )}

              {ev.maxAttendees && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">👥</span>
                  <span>Max: {ev.maxAttendees}</span>
                </div>
              )}

              {/* Event Status */}
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📊</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    new Date(ev.eventDate) < new Date()
                      ? "bg-gray-100 text-gray-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {new Date(ev.eventDate) < new Date()
                    ? "Past Event"
                    : "Upcoming Event"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewEvent(ev._id)}
                  className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition flex items-center gap-1"
                  title="View Event"
                >
                  👁️ View
                </button>
                <button
                  onClick={() => handleUpdateEvent(ev._id)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition flex items-center gap-1"
                  title="Edit Event"
                  disabled={loading}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteEvent(ev._id, ev.title)}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition flex items-center gap-1"
                  title="Delete Event"
                  disabled={loading}
                >
                  🗑️ Delete
                </button>
              </div>

              {/* Created Date */}
              <div className="text-xs text-gray-400">
                {new Date(ev.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
