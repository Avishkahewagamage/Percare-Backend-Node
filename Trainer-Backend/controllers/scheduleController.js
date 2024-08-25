const Schedule = require('../models/schedule');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Add or Update Trainer Schedule
exports.saveSchedule = (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ message: 'No token provided.' });

    jwt.verify(token, config.jwtSecret, async (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Failed to authenticate token.' });

        const scheduleData = req.body.schedule;

        try {
            const updatedSchedule = await Schedule.findOneAndUpdate(
                { trainer: decoded.id }, // Updated reference
                { $set: { schedule: scheduleData } },
                { new: true, upsert: true }
            );

            res.status(200).json({ message: 'Schedule saved successfully.', schedule: updatedSchedule });
        } catch (error) {
            res.status(500).json({ error: 'Error saving schedule.' });
        }
    });
};

// View Trainer's Schedule
exports.viewSchedule = (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ message: 'No token provided.' });

    jwt.verify(token, config.jwtSecret, async (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Failed to authenticate token.' });

        try {
            const schedule = await Schedule.findOne({ trainer: decoded.id }); // Updated reference
            res.status(200).json(schedule);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching schedule.' });
        }
    });
};

// Delete Trainer's Schedule
exports.deleteSchedule = (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ message: 'No token provided.' });

    jwt.verify(token, config.jwtSecret, async (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Failed to authenticate token.' });

        try {
            const schedule = await Schedule.findOneAndDelete({ trainer: decoded.id }); // Updated reference

            if (!schedule) {
                return res.status(404).json({ error: 'Schedule not found or unauthorized.' });
            }

            res.status(200).json({ message: 'Schedule deleted successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting schedule.' });
        }
    });
};

// Get All Schedules
exports.getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find().populate('trainer', 'username'); // Updated reference
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching schedules.' });
    }
};

// View specific trainer's schedule
exports.viewScheduleByTrainer = async (req, res) => { // Updated method name
    const trainerId = req.params.trainerId; // Updated parameter name

    try {
        const schedule = await Schedule.findOne({ trainer: trainerId }); // Updated reference
        if (!schedule) return res.status(404).json({ message: 'Schedule not found.' });
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching schedule.' });
    }
};
