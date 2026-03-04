const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema(
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
        ratings: {
            overall_experience: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
            },
            venue_facilities: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
            },
            speakers_program: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
            },
            event_organization: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
            },
        },
        comment: {
            type: String,
            trim: true,
            default: '',
        },
        is_anonymous: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Prevents a user from submitting feedback more than once per event
FeedbackSchema.index({ event_id: 1, user_id: 1 }, { unique: true });

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;
