import { use, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext/AuthContext";
import toast from "react-hot-toast";


export const CreateEvents = () => {
  const { user } = use(AuthContext);
  const [token, setToken] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");
  const [events, setEvents] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    isPaid: false,
    eventFee: 0,
    maxAttendees: 0,
  });

  // Get Firebase token
  useEffect(() => {
    if (user) {
      user.getIdToken().then((idToken) => setToken(idToken));
    }
  }, [user]);

  // Fetch manager's clubs
  useEffect(() => {
    if (user && token) {
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/clubs?managerEmail=${user.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setClubs(res.data);
          if (res.data.length > 0) setSelectedClub(res.data[0]._id);
        });
    }
  }, [user, token]);

  // Fetch manager's events
  useEffect(() => {
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/events/manager`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setEvents(res.data));
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!selectedClub) return alert("Select a club first");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/events`,
        { ...form, clubId: selectedClub },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Event created!");
      // Refresh events
      const updatedEvents = await axios.get(
        `${import.meta.env.VITE_API_URL}/events/manager`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(updatedEvents.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating event");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Events</h1>

      {/* Select Club */}
      <div>
        <label>Select Club:</label>
        <select
          className="border p-2 rounded ml-2"
          value={selectedClub}
          onChange={(e) => setSelectedClub(e.target.value)}
        >
          {clubs.map((club) => (
            <option key={club._id} value={club._id}>
              {club.clubName}
            </option>
          ))}
        </select>
      </div>

      {/* Create Event Form */}
      <form
        onSubmit={handleCreateEvent}
        className="space-y-2 border p-4 rounded"
      >
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          type="date"
          name="eventDate"
          value={form.eventDate}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <div className="flex items-center space-x-2">
          <label>Paid Event:</label>
          <input
            type="checkbox"
            name="isPaid"
            checked={form.isPaid}
            onChange={handleChange}
          />
          {form.isPaid && (
            <input
              type="number"
              name="eventFee"
              placeholder="Event Fee"
              value={form.eventFee}
              onChange={handleChange}
              className="border p-2 w-32 rounded"
            />
          )}
        </div>
        <input
          type="number"
          name="maxAttendees"
          placeholder="Max Attendees"
          value={form.maxAttendees}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};
