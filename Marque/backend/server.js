// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// Models
const User = require("./models/User");           
const Student = require("./models/Student");     
const Organization = require("./models/Organization"); 
const Event = require("./models/Event");         

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ===== MONGODB CONNECTION =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ===== LOGIN ROUTE =====
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== DASHBOARD STATS ROUTE =====
app.get("/dashboard-stats", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalOrganizations = await Organization.countDocuments();
    const totalEvents = await Event.countDocuments();
    const concludedEvents = await Event.countDocuments({ status: "Concluded" });
    const upcomingEvents = await Event.countDocuments({ status: "Upcoming" });

    // Pending Approvals based only on Events
    const pendingApprovals = await Event.countDocuments({ status: "Pending" });

    res.json({
      totalStudents,
      totalOrganizations,
      totalEvents,
      upcomingEvents,
      pendingApprovals,
      concludedEvents     // ✅ new stat
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== RECENT EVENTS ROUTE (ALL EVENTS) =====
app.get("/recent-events", async (req, res) => {
  try {
    // Get all events, sorted by newest first
    const recentEvents = await Event.find()
      .sort({ event_date: -1 })
      .select("event_name status event_date venue");

    // Map into the structure for frontend
    const activity = recentEvents.map(e => ({
      name: e.event_name,
      venue: e.venue,
      status: e.status,
      time: e.event_date  // frontend can format this
    }));

    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));