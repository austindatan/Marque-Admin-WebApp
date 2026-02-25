const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    name: { type: String, required: true },
    course: { type: String },
    yearLevel: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Student", StudentSchema);