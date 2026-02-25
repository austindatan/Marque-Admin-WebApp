const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    event_name: { type: String, required: true },  // renamed from title
    event_type: { type: String },
    description: { type: String },
    event_image: { type: String },
    event_date: { type: Date },
    start_time: { type: Date },
    end_time: { type: Date },
    venue: { type: String },
    venue_details: { type: String },
    status: { type: String, default: "Pending" }, // Pending / Concluded / Upcoming
    is_mandatory: { type: Boolean, default: false },
    remindersSent: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", EventSchema);