import { useState, useEffect } from "react";
import api from "../services/api";
import { format } from "date-fns";

function PatientDashboard() {
  const [slots, setSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [slotsRes, bookingsRes] = await Promise.all([
        api.get("/slots"),
        api.get("/my-bookings"),
      ]);
      setSlots(slotsRes.data);
      setMyBookings(bookingsRes.data);
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookSlot = async (slotId) => {
    setError("");
    try {
      await api.post("/book", { slotId });
      alert("Booking successful!");
      fetchData(); // Refresh data after booking
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to book slot.");
      alert(
        `Error: ${err.response?.data?.error?.message || "Failed to book slot."}`
      );
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <div className="section">
        <h2>My Bookings</h2>
        {myBookings.length > 0 ? (
          <ul>
            {myBookings.map((b) => (
              <li key={b.id}>
                {format(new Date(b.slotId), "EEEE, MMM d, yyyy @ h:mm a")}
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no appointments.</p>
        )}
      </div>
      <div className="section">
        <h2>Available Slots (Next 7 Days)</h2>
        {error && <p className="error-message">{error}</p>}
        <ul className="slot-list">
          {slots.map((slot) => (
            <li key={slot.id}>
              <span>
                {format(new Date(slot.start_at), "EEE, MMM d @ h:mm a")}
              </span>
              <button onClick={() => handleBookSlot(slot.id)}>Book</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default PatientDashboard;
