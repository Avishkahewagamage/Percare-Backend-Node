const express = require('express');
const router = express.Router();
const Groomer = require('../models/groomer'); // Updated model path

// Get all groomers
router.get('/', async (req, res) => {
    try {
        const groomers = await Groomer.find(); // Updated reference
        res.status(200).json(groomers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching groomers.' }); // Updated message
    }
});

module.exports = router;
