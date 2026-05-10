const express = require('express');
const router = express.Router();
const AttendanceLog = require('../models/Attendance_log');
const Student = require('../models/Student');
const Event = require('../models/Event');

router.post('/scan', async (req, res) => {
    try {
        const { studentNumber, eventId } = req.body;

        const student = await Student.findOne({ student_number: studentNumber }).populate('users_id');
        const event = await Event.findById(eventId);

        if (!student) return res.status(404).json({ message: "Student not found" });
        if (!event) return res.status(404).json({ message: "Event not found" });

        const existingLog = await AttendanceLog.findOne({ event_id: eventId, user_id: student.users_id._id });
        if (existingLog) return res.status(400).json({ message: "Student already checked in" });

        const currentTime = new Date();
        const eventStartTime = new Date(event.start_time);
        const status = currentTime > eventStartTime ? 'Late' : 'Present';

        const newLog = new AttendanceLog({
            event_id: eventId,
            user_id: student.users_id._id,
            status: status,
            time_in: currentTime,
        });

        await newLog.save();

        res.json({
            id: student.student_number,
            name: `${student.users_id.firstname} ${student.users_id.lastname}`,
            status: status,
            time: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            method: 'QR'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/monitoring/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const logs = await AttendanceLog.find({ event_id: eventId })
            .populate('user_id') 
            .sort({ time_in: -1 });

        const formattedLogs = await Promise.all(logs.map(async (log) => {
            const student = await Student.findOne({ users_id: log.user_id?._id })
                .populate('college_id', 'college_name')
                .populate('department_id', 'department_name');
            
            return {
                _id: log._id,
                student_number: student ? student.student_number : 'N/A',
                name: log.user_id 
                    ? `${log.user_id.firstname} ${log.user_id.lastname}` 
                    : 'Unknown Student',
                email: log.user_id?.email || 'N/A',
                college: student?.college_id?.college_name || 'N/A',
                department: student?.department_id?.department_name || 'N/A',
                time_in: log.time_in,
                status: log.status
            };
        }));

        res.json(formattedLogs);
    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ message: "Error fetching attendance" });
    }
});

module.exports = router;