import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { use } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";

export const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = use(AuthContext);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [token, setToken] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    isPaid: false,
    eventFee: 0,
    maxAttendees: "",
  });

  const [clubs, setClubs] = useState([]);

  // Get Firebase token
  useEffect(() => {
    if (user) {
      user.getIdToken().then((idToken) => setToken(idToken));
    }
  }, [user]);

  // Fetch event details and manager's clubs
  useEffect(() => {
    if (!token || !id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch event details
        const eventRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/events/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const event = eventRes.data;

        // Fetch manager's clubs
        const clubsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/clubs?managerEmail=${user.email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setClubs(clubsRes.data);

        // Set form data
        const eventDate = new Date(event.eventDate);
        const formattedDate = eventDate.toISOString().slice(0, 16);

        setFormData({
          title: event.title || "",
          description: event.description || "",
          eventDate: formattedDate,
          location: event.location || "",
          isPaid: event.isPaid || false,
          eventFee: event.eventFee || 0,
          maxAttendees: event.maxAttendees || "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage({
          type: "error",
          text: "Failed to load event details",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, id, user?.email]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        ...(name === "isPaid" && !checked ? { eventFee: 0 } : {}),
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      setMessage({ type: "error", text: "Event title is required" });
      return;
    }

    if (!formData.eventDate) {
      setMessage({ type: "error", text: "Event date is required" });
      return;
    }

    if (formData.isPaid && formData.eventFee <= 0) {
      setMessage({
        type: "error",
        text: "Event fee must be greater than 0 for paid events",
      });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/events/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "Event updated successfully!",
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/dashboard/manager/events");
        }, 2000);
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update event",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit Event</h1>
        <p className="text-gray-600 mt-2">Update your event information</p>
      </div>

      {/* Message Display */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 space-y-6"
      >
        {/* Event Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter event title"
            required
            disabled={saving}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your event..."
            disabled={saving}
          />
        </div>

        {/* Date and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Date & Time *
            </label>
            <input
              type="datetime-local"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Venue or online meeting link"
              disabled={saving}
            />
          </div>
        </div>

        {/* Payment Settings */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isPaid"
              name="isPaid"
              checked={formData.isPaid}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
              disabled={saving}
            />
            <label
              htmlFor="isPaid"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              This is a paid event
            </label>
          </div>

          {formData.isPaid && (
            <div className="ml-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Fee (USD) *
              </label>
              <input
                type="number"
                name="eventFee"
                value={formData.eventFee}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                required={formData.isPaid}
                disabled={saving}
              />
              <p className="text-sm text-gray-500 mt-2">
                Participants will need to pay this amount to register
              </p>
            </div>
          )}
        </div>

        {/* Max Attendees */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Attendees (Optional)
          </label>
          <input
            type="number"
            name="maxAttendees"
            value={formData.maxAttendees}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Leave empty for unlimited"
            disabled={saving}
          />
          <p className="text-sm text-gray-500 mt-2">
            Set a limit on how many people can register for this event
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard/manager/events")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <>
                <div className="loading loading-spinner loading-sm mr-2"></div>
                Updating...
              </>
            ) : (
              "Update Event"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
