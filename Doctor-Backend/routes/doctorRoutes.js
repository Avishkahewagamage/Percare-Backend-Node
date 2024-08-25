const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctor'); // Make sure path is correct

// Get all doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching doctors.' });
    }
});

module.exports = router;
