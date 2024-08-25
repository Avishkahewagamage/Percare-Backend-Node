const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Routes

// Save or update doctor's schedule
router.post('/save', scheduleController.saveSchedule);

// View doctor's own schedule
router.get('/view', scheduleController.viewSchedule);

// Delete doctor's schedule
router.delete('/delete', scheduleController.deleteSchedule);

// Get all schedules (admin or for general purposes)
router.get('/all', scheduleController.getAllSchedules);

// View specific doctor's schedule
router.get('/doctor/:doctorId', scheduleController.viewScheduleByDoctor);


module.exports = router;
