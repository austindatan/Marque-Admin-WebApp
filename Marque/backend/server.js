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
const attendanceRoutes = require("./routes/attendance");
const studentRoutes = require("./routes/studentRoutes");


const app = express();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const uploadStream = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "organizations" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// Middleware
app.use(cors());
app.use(express.json());
app.use("/attendance", attendanceRoutes);
app.use("/api/students", studentRoutes);

// ===== MONGODB CONNECTION =====
mongoose.connect(process.env.MONGODB_URI)
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

// ===== ALL EVENTS ROUTE =====
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ event_date: -1 });

    // Resolve Cloudinary image URLs
    const eventsWithImages = events.map(e => {
      const obj = e.toObject();
      if (obj.event_image) {
        // If already a full URL, keep it; otherwise build Cloudinary URL
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

// ===== ALL ORGANIZATIONS ROUTE =====
app.get("/organizations", async (req, res) => {
  try {
    const orgs = await Organization.find()
      .populate({
        path: "department_id",
        select: "department_name department_code college_id",
        populate: { path: "college_id", select: "college_name college_code" }
      })
      .sort({ org_name: 1 })
      .lean();
    res.json(orgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== ADD ORGANIZATION ROUTE =====
app.post("/organizations", upload.single("logo"), async (req, res) => {
  try {
    const { name, type, department, description, moderator, facebookLink, instagramLink, xLink } = req.body;

    if (!name || !type || !department || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let uploadedLogoUrl = "";
    if (req.file) {
      const uploadRes = await uploadStream(req.file.buffer);
      uploadedLogoUrl = uploadRes.secure_url;
    }

    const newOrg = new Organization({
      org_name: name,
      org_type: type,
      department_id: department,
      description: description,
      moderator_name: moderator || "",
      fb_link: facebookLink || "",
      ig_link: instagramLink || "",
      x_link: xLink || "",
      pfp: uploadedLogoUrl,
    });

    await newOrg.save();
    res.status(201).json(newOrg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== EDIT ORGANIZATION ROUTE =====
app.put("/organizations/:id", upload.single("logo"), async (req, res) => {
  try {
    const { name, type, department, description, moderator, facebookLink, instagramLink, xLink } = req.body;

    const updateData = {
      org_name: name,
      org_type: type,
      department_id: department,
      description: description,
      moderator_name: moderator || "",
      fb_link: facebookLink || "",
      ig_link: instagramLink || "",
      x_link: xLink || "",
    };

    if (req.file) {
      const uploadRes = await uploadStream(req.file.buffer);
      updateData.pfp = uploadRes.secure_url;
    }

    const updatedOrg = await Organization.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
    if (!updatedOrg) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.json(updatedOrg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== DELETE ORGANIZATION ROUTE =====
app.delete("/organizations/:id", async (req, res) => {
  try {
    const deletedOrg = await Organization.findByIdAndDelete(req.params.id);
    if (!deletedOrg) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // optionally, you could also remove OrgOfficers associated with this org
    const OrgOfficer = require('./models/Org_officer');
    await OrgOfficer.deleteMany({ org_id: req.params.id });

    res.json({ message: "Organization deleted successfully", deletedOrg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== ALL STUDENTS ROUTE =====
app.get("/students", async (req, res) => {
  try {
    // Fetch all students with populated references
    const students = await Student.find()
      .populate("users_id", "username firstname middlename lastname email contact_number profile_image")
      .populate("college_id", "college_name college_code")
      .populate("department_id", "department_name department_code")
      .lean();

    // Get ALL org-officer records, populate org name + pfp
    const officers = await OrgOfficer.find()
      .populate("org_id", "org_name pfp")
      .lean();

    // Build a map: student_id -> [ { org_id, org_name, pfp, role }, ... ]
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

    // Merge org list into each student
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

// ===== COLLEGES ROUTE (for filter dropdown) =====
app.get("/colleges", async (req, res) => {
  try {
    const colleges = await College.find().sort({ college_name: 1 }).lean();
    res.json(colleges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== DEPARTMENTS ROUTE (for filter dropdown, optional college filter) =====
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