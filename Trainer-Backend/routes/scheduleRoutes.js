const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Routes

// Save or update trainer's schedule
router.post('/save', scheduleController.saveSchedule);

// View trainer's own schedule
router.get('/view', scheduleController.viewSchedule);

// Delete trainer's schedule
router.delete('/delete', scheduleController.deleteSchedule);

// Get all schedules (admin or for general purposes)
router.get('/all', scheduleController.getAllSchedules);

// View specific trainer's schedule
router.get('/trainer/:trainerId', scheduleController.viewScheduleByTrainer); // Updated route and method

module.exports = router;
