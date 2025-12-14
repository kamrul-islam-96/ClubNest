import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router";

export const UpComingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/events`);
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <p className="p-6">Loading events...</p>;

  if (events.length === 0)
    return <p className="p-6 text-gray-500">No upcoming events.</p>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((ev) => (
        <div
          key={ev._id}
          className="border rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col justify-between bg-white"
        >
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-xl font-bold text-gray-800">{ev.title}</h2>
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

          {ev.description && (
            <p className="text-gray-600 mb-3 line-clamp-3">{ev.description}</p>
          )}

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
            <p>
              <span className="font-semibold">Club:</span> {ev.clubName}
            </p>
            {ev.maxAttendees && (
              <p>
                <span className="font-semibold">Max Attendees:</span>{" "}
                {ev.maxAttendees}
              </p>
            )}
          </div>

          <NavLink to={`/events/${ev._id}`} className="mt-auto px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
            View / Register
          </NavLink>
        </div>
      ))}
    </div>
  );
};
