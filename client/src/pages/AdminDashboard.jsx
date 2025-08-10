import { useState, useEffect } from "react";
import api from "../services/api";
import { format } from "date-fns";

function AdminDashboard() {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllBookings = async () => {
      setLoading(true);
      try {
        const response = await api.get("/all-bookings");
        setAllBookings(response.data);
      } catch (err) {
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllBookings();
  }, []);

  if (loading) return <p>Loading all bookings...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <h2>All Clinic Bookings</h2>
      {allBookings.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Patient Name</th>
              <th>Patient Email</th>
            </tr>
          </thead>
          <tbody>
            {allBookings.map((booking) => (
              <tr key={booking.id}>
                <td>
                  {format(new Date(booking.slotId), "yyyy-MM-dd @ HH:mm")}
                </td>
                <td>{booking.user.name}</td>
                <td>{booking.user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>There are no bookings in the system.</p>
      )}
    </div>
  );
}
export default AdminDashboard;
