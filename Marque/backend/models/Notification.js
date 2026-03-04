// models/Notification.js

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        organization_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
        event_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            default: null, // Nullable: used only for type: "event"
        },
        type: {
            type: String,
            enum: ["invite", "event", "role_change", "announcement"],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        role: { // USED BY: 'invite' and 'role_change'
            type: String,
            enum: ['Committee', 'Manager'],
            default: null,
        },
        status: { // USED BY: 'invite' to track action state
            type: String,
            enum: ['pending', 'accepted', 'rejected', 'info'],
            default: 'info', // 'info' for read-only (event/role_change, announcement)
        },
        is_read: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
