import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Sparkles,
  DollarSign,
} from "lucide-react";

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

  // 🔥 Helper function to check if event is truly free
  const isEventFree = (event) => {
    // Event is free if:
    // 1. isPaid is false OR
    // 2. eventFee is 0 or null/undefined
    const eventFee = Number(event.eventFee) || 0;
    return !event.isPaid || eventFee === 0;
  };

  // --- Awesome Skeleton Loader ---
  if (loading) {
    return (
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-[350px] bg-gray-100 rounded-[2.5rem] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (events.length === 0)
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-gray-500 italic">
        <Sparkles className="mb-2 text-gray-300" size={40} />
        <p>No upcoming events at the moment.</p>
      </div>
    );

  return (
    <div className="p-8 bg-[#fcfcfd] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((ev) => {
        const isFree = isEventFree(ev);
        const eventFee = Number(ev.eventFee) || 0;

        return (
          <div
            key={ev._id}
            className="group relative bg-white border border-gray-100 rounded-[2.5rem] p-7 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(59,130,246,0.12)] transition-all duration-500 flex flex-col justify-between overflow-hidden"
          >
            {/* Top Section: Title & Status */}
            <div>
              <div className="flex justify-between items-start mb-5">
                <h2 className="text-2xl font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                  {ev.title}
                </h2>
                <span
                  className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                    !isFree
                      ? "bg-amber-50 text-amber-600 border-amber-100"
                      : "bg-emerald-50 text-emerald-600 border-emerald-100"
                  }`}
                >
                  {!isFree ? `$${eventFee}` : "Free"}
                </span>
              </div>

              {ev.description && (
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 font-light">
                  {ev.description}
                </p>
              )}

              {/* Event Meta Details */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 text-gray-600 group/item">
                  <div className="p-2.5 bg-gray-50 rounded-2xl group-hover/item:bg-blue-50 group-hover/item:text-blue-600 transition-all">
                    <Calendar size={18} />
                  </div>
                  <span className="text-sm font-medium">
                    {new Date(ev.eventDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {ev.location && (
                  <div className="flex items-center gap-4 text-gray-600 group/item">
                    <div className="p-2.5 bg-gray-50 rounded-2xl group-hover/item:bg-rose-50 group-hover/item:text-rose-600 transition-all">
                      <MapPin size={18} />
                    </div>
                    <span className="text-sm font-medium truncate">
                      {ev.location}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-4 text-gray-600 group/item">
                  <div className="p-2.5 bg-gray-50 rounded-2xl group-hover/item:bg-indigo-50 group-hover/item:text-indigo-600 transition-all">
                    <Users size={18} />
                  </div>
                  <span className="text-sm font-medium italic">
                    Hosted by {ev.clubName}
                    {ev.maxAttendees && (
                      <span className="not-italic text-gray-400 ml-2">
                        ({ev.maxAttendees} max)
                      </span>
                    )}
                  </span>
                </div>

                {/* Show event fee for paid events */}
                {!isFree && (
                  <div className="flex items-center gap-4 text-gray-600 group/item">
                    <div className="p-2.5 bg-gray-50 rounded-2xl group-hover/item:bg-amber-50 group-hover/item:text-amber-600 transition-all">
                      <DollarSign size={18} />
                    </div>
                    <span className="text-sm font-medium">
                      Registration Fee: ${eventFee}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <NavLink
              to={`/events/${ev._id}`}
              className="group/btn relative mt-auto flex items-center justify-center gap-3 w-full py-4 bg-gray-900 text-white rounded-3xl font-bold overflow-hidden transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 active:scale-95"
            >
              <span className="z-10">
                {isFree ? "Register for Free" : `Register - $${eventFee}`}
              </span>
              <ArrowRight
                size={18}
                className="z-10 group-hover/btn:translate-x-2 transition-transform duration-300"
              />
            </NavLink>
          </div>
        );
      })}
    </div>
  );
};
