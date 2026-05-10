// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("./config/cloudinary");
const bcrypt = require("bcryptjs");

// Models
const User = require("./models/User");
const Student = require("./models/Student");
const Organization = require("./models/Organization");
const Event = require("./models/Event");
const College = require("./models/College");
const Department = require("./models/Department");
const OrgOfficer = require("./models/Org_officer");

// Routes
const attendanceRoutes = require("./routes/attendance");
const studentRoutes = require("./routes/studentRoutes");
const organizationRoutes = require("./routes/organizationRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ===== MONGODB CONNECTION =====
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ===== LOGIN ROUTE =====
const jwt = require("jsonwebtoken");

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Restrict access to Admins only
    if (user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Only administrators can log into this portal." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: "admin" },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== AUTH MIDDLEWARE =====
const authMiddleware = require("./middleware/auth");
app.use(authMiddleware);

// ===== MOUNT ROUTES =====
app.use("/attendance", attendanceRoutes);
app.use("/api/students", studentRoutes);
app.use("/organizations", organizationRoutes);

// ===== DASHBOARD STATS ROUTE =====
app.get("/dashboard-stats", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalOrganizations = await Organization.countDocuments();
    const totalEvents = await Event.countDocuments();
    const concludedEvents = await Event.countDocuments({ status: "Concluded" });
    const upcomingEvents = await Event.countDocuments({ status: "Upcoming" });

    const pendingApprovals = await Event.countDocuments({ status: "Pending" });

    res.json({
      totalStudents,
      totalOrganizations,
      totalEvents,
      upcomingEvents,
      pendingApprovals,
      concludedEvents
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== RECENT EVENTS ROUTE =====
app.get("/recent-events", async (req, res) => {
  try {
    const recentEvents = await Event.find()
      .sort({ event_date: -1 })
      .select("event_name status event_date venue event_image organization_id")
      .populate({ path: 'organization_id', select: 'org_name pfp' });

    const activity = recentEvents.map(e => ({
      _id: e._id,
      name: e.event_name,
      venue: e.venue,
      status: e.status,
      time: e.event_date,
      event_image: e.event_image,
      organization: e.organization_id?.org_name || 'Unknown Organization',
      org_logo: e.organization_id?.pfp
    }));

    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== ALL EVENTS ROUTE =====
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ event_date: -1 }).populate({
      path: 'organization_id',
      select: 'org_name pfp org_type department_id',
      populate: {
        path: 'department_id',
        select: 'department_name college_id',
        populate: {
          path: 'college_id',
          select: 'college_name'
        }
      }
    });

    const eventsWithImages = events.map(e => {
      const obj = e.toObject();
      if (obj.event_image) {
        if (!obj.event_image.startsWith('http')) {
          obj.event_image = cloudinary.url(obj.event_image, {
            secure: true,
            width: 800,
            crop: 'limit',
            quality: 'auto',
            fetch_format: 'auto',
          });
        }
      }
      return obj;
    });

    res.json(eventsWithImages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== DELETE EVENT ROUTE =====
app.delete("/events/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    try {
      const AttendanceLog = require('./models/Attendance_log');
      if (AttendanceLog) {
        await AttendanceLog.deleteMany({ event_id: req.params.id });
      }
    } catch (e) {
      console.error("Failed to delete attendance logs for event:", e);
    }

    res.json({ message: "Event deleted successfully", deletedEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== ALL STUDENTS ROUTE =====
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find()
      .populate("users_id", "username firstname middlename lastname email contact_number profile_image")
      .populate("college_id", "college_name college_code")
      .populate("department_id", "department_name department_code")
      .lean();

    const officers = await OrgOfficer.find()
      .populate("org_id", "org_name pfp")
      .lean();

    const orgMap = {};
    officers.forEach(o => {
      const sid = o.student_id.toString();
      if (!orgMap[sid]) orgMap[sid] = [];
      orgMap[sid].push({
        org_id: o.org_id?._id ?? null,
        org_name: o.org_id?.org_name ?? 'Unknown',
        pfp: o.org_id?.pfp ?? null,
        role: o.role,
      });
    });

    const result = students.map(s => ({
      ...s,
      orgs: orgMap[s._id.toString()] || [],
      hasRole: !!(orgMap[s._id.toString()]?.length),
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== COLLEGES ROUTE =====
app.get("/colleges", async (req, res) => {
  try {
    const colleges = await College.find().sort({ college_name: 1 }).lean();
    res.json(colleges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== DEPARTMENTS ROUTES =====
app.post("/departments", async (req, res) => {
  try {
    const { department_name, department_code, college_id } = req.body;
    let dept = await Department.findOne({ department_name, college_id });
    if (!dept) {
      dept = new Department({ department_name, department_code, college_id });
      await dept.save();
    }
    res.status(201).json(dept);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/departments", async (req, res) => {
  try {
    const query = req.query.college_id ? { college_id: req.query.college_id } : {};
    const departments = await Department.find(query).sort({ department_name: 1 }).lean();
    res.json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));