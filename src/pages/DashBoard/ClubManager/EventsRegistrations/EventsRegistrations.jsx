// pages/manager/EventsRegistrations.jsx
import React, { use, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";
import { toast } from "react-hot-toast";
import {
  Search,
  Filter,
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Download,
  Eye,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export const EventsRegistrations = () => {
  const { user } = use(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch manager's events with registrations
  const {
    data: events = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["managerEventsRegistrations"],
    queryFn: async () => {
      if (!user) return [];

      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/events/manager`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }

      return res.json();
    },
    enabled: !!user,
  });

  // Fetch registrations for selected event
  const {
    data: registrations = [],
    isLoading: loadingRegistrations,
    refetch: refetchRegistrations,
  } = useQuery({
    queryKey: ["eventRegistrations", selectedEvent?._id],
    queryFn: async () => {
      if (!selectedEvent || !user) return [];

      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/manager/event-registrations/${
          selectedEvent._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch registrations");
      }

      return res.json();
    },
    enabled: !!selectedEvent && !!user,
  });

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.clubName.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "upcoming")
      return matchesSearch && new Date(event.eventDate) > new Date();
    if (statusFilter === "past")
      return matchesSearch && new Date(event.eventDate) < new Date();

    return matchesSearch;
  });

  // Calculate event statistics
  const calculateEventStats = (event) => {
    const totalRegistrations = event.registeredUsersCount || 0;
    const paidRegistrations = registrations.filter(
      (r) => r.status === "registered" && r.paymentId
    ).length;
    const pendingPayments = registrations.filter(
      (r) => r.status === "pendingPayment"
    ).length;
    const revenue = paidRegistrations * (event.eventFee || 0);

    return { totalRegistrations, paidRegistrations, pendingPayments, revenue };
  };

  // Handle status change
  const handleStatusChange = async (registrationId, newStatus) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/manager/event-registrations/${registrationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update status");
      }

      toast.success("Registration status updated");
      refetchRegistrations();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Error loading events: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pl-6 pr-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Event Registrations
          </h1>
          <p className="text-gray-600">
            Manage and view all event registrations
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Events</p>
              <p className="text-2xl font-bold">{events.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Registrations</p>
              <p className="text-2xl font-bold">
                {events.reduce(
                  (sum, event) => sum + (event.registeredUsersCount || 0),
                  0
                )}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Paid Registrations</p>
              <p className="text-2xl font-bold">
                {events.reduce((sum, event) => {
                  const stats = calculateEventStats(event);
                  return sum + stats.paidRegistrations;
                }, 0)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Payments</p>
              <p className="text-2xl font-bold">
                {events.reduce((sum, event) => {
                  const stats = calculateEventStats(event);
                  return sum + stats.pendingPayments;
                }, 0)}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Events List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events by title or club..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past Events</option>
              </select>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow border text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No events found</p>
              </div>
            ) : (
              filteredEvents.map((event) => {
                const stats = calculateEventStats(event);
                const isSelected = selectedEvent?._id === event._id;

                return (
                  <div
                    key={event._id}
                    className={`bg-white p-4 rounded-lg shadow border cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowDetails(true);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-gray-600 text-sm">
                          {event.clubName}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(event.eventDate).toLocaleDateString()}
                          </span>

                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {stats.totalRegistrations} registered
                          </span>

                          {event.isPaid && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />${stats.revenue}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            new Date(event.eventDate) > new Date()
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {new Date(event.eventDate) > new Date()
                            ? "Upcoming"
                            : "Past"}
                        </span>

                        {stats.pendingPayments > 0 && (
                          <span className="mt-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                            {stats.pendingPayments} pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column - Registration Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow border sticky top-4">
            {!selectedEvent ? (
              <div className="p-8 text-center">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Select an event to view registrations
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {/* Event Header */}
                <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50">
                  <h3 className="font-bold text-lg">{selectedEvent.title}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedEvent.clubName}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs text-gray-500">
                      📅{" "}
                      {new Date(selectedEvent.eventDate).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      📍 {selectedEvent.location}
                    </span>
                  </div>
                </div>

                {/* Registration Stats */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold">
                        {registrations.length}
                      </p>
                      <p className="text-xs text-gray-600">Total</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold">
                        {
                          registrations.filter((r) => r.status === "registered")
                            .length
                        }
                      </p>
                      <p className="text-xs text-gray-600">Confirmed</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold">
                        {
                          registrations.filter(
                            (r) => r.status === "pendingPayment"
                          ).length
                        }
                      </p>
                      <p className="text-xs text-gray-600">Pending</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold">
                        {
                          registrations.filter((r) => r.status === "cancelled")
                            .length
                        }
                      </p>
                      <p className="text-xs text-gray-600">Cancelled</p>
                    </div>
                  </div>
                </div>

                {/* Registrations List */}
                <div className="p-4">
                  <h4 className="font-semibold mb-3">
                    Registrations ({registrations.length})
                  </h4>

                  {loadingRegistrations ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : registrations.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No registrations yet
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {registrations.map((registration) => (
                        <div
                          key={registration._id}
                          className="p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {registration.userName ||
                                  registration.userEmail}
                              </p>
                              <p className="text-xs text-gray-500">
                                {registration.userEmail}
                              </p>

                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    registration.status === "registered"
                                      ? "bg-green-100 text-green-700"
                                      : registration.status === "pendingPayment"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {registration.status}
                                </span>

                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    registration.registeredAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <div className="dropdown dropdown-end">
                              <button className="btn btn-xs btn-ghost">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              <ul className="dropdown-content menu p-2 shadow bg-white rounded-lg w-32">
                                <li>
                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        registration._id,
                                        "registered"
                                      )
                                    }
                                  >
                                    Mark as Confirmed
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        registration._id,
                                        "cancelled"
                                      )
                                    }
                                  >
                                    Mark as Cancelled
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>

                          {selectedEvent.isPaid && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Payment: </span>
                              {registration.paymentId ? (
                                <span className="text-green-600">
                                  Paid (${selectedEvent.eventFee})
                                </span>
                              ) : (
                                <span className="text-orange-600">Pending</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
