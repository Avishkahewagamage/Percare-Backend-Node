const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Routes

// Save or update groomer's schedule
router.post('/save', scheduleController.saveSchedule);

// View groomer's own schedule
router.get('/view', scheduleController.viewSchedule);

// Delete groomer's schedule
router.delete('/delete', scheduleController.deleteSchedule);

// Get all schedules (admin or for general purposes)
router.get('/all', scheduleController.getAllSchedules);

// View specific groomer's schedule
router.get('/groomer/:groomerId', scheduleController.viewScheduleByGroomer); // Updated route and method

module.exports = router;
