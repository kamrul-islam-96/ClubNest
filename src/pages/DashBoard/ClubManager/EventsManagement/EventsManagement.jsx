import { use, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";

export const EventsManagement = () => {
  const { user } = use(AuthContext);
  const [token, setToken] = useState(null);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  // Get Firebase token
  useEffect(() => {
    if (user) {
      user.getIdToken().then((idToken) => setToken(idToken));
    }
  }, [user]);

  // Fetch manager's events
  useEffect(() => {
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/events/manager`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setEvents(res.data))
        .catch((err) => console.error(err));
    }
  }, [token]);

  return (
    <div className="p-6 space-y-6">
      {/* Header + Create Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Events</h1>
        <button
          onClick={() => navigate("/dashboard/manager/create-event")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          + Create Event
        </button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No events created yet.
          </p>
        )}

        {events.map((ev) => (
          <div
            key={ev._id}
            className="border rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col justify-between bg-white"
          >
            {/* Event Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{ev.title}</h2>
                {/* Club Name */}
                <p className="text-sm text-gray-500 mt-1">
                  Club: {ev.clubName}
                </p>
              </div>
              {ev.isPaid ? (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                  Paid
                </span>
              ) : (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                  Free
                </span>
              )}
            </div>

            {/* Event Description */}
            {ev.description && (
              <p className="text-gray-600 mb-3 line-clamp-3">
                {ev.description}
              </p>
            )}

            {/* Event Details */}
            <div className="text-gray-700 mb-3 space-y-1 text-sm">
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(ev.eventDate).toLocaleDateString()}
              </p>
              {ev.location && (
                <p>
                  <span className="font-semibold">Location:</span> {ev.location}
                </p>
              )}
              {ev.maxAttendees && (
                <p>
                  <span className="font-semibold">Max Attendees:</span>{" "}
                  {ev.maxAttendees}
                </p>
              )}
              {/* Dynamic: Number of Users Registered */}
              <p>
                <span className="font-semibold">Registered:</span>{" "}
                {ev.registeredUsers?.length || 0}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-200">
              <div className="space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                  Update
                </button>
                <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition">
                  Delete
                </button>
              </div>
              <span className="text-xs text-gray-400">Created by you</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
