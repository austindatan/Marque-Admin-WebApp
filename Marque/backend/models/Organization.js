const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String },
    status: { type: String, default: "Pending" }, // Pending / Approved
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Organization", OrganizationSchema);