require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // We will configure this for production later
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", bookingRoutes);
// Basic Route for testing
app.get("/api", (req, res) => {
  res.send("Appointment Booking API is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
