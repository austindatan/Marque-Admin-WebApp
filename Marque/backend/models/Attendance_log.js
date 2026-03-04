const mongoose = require('mongoose');

const AttendanceLogSchema = new mongoose.Schema(
    {
        event_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true },
        time_in: { type: Date, required: true },
        time_out: { type: Date },

        // Photo proof fields
        photoproof_url: { type: String, default: null },
        photoproof_status: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending',
        },
        photoproof_submitted_at: { type: Date, default: null },
        photoproof_verified_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        photoproof_verified_at: { type: Date, default: null },
    },
);

const AttendanceLog = mongoose.model('Attendance_log', AttendanceLogSchema);

module.exports = AttendanceLog;
