const express = require('express');
const router = express.Router();
const Trainer = require('../models/trainer'); // Updated model path

// Get all trainers
router.get('/', async (req, res) => {
    try {
        const trainers = await Trainer.find(); // Updated reference
        res.status(200).json(trainers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching trainers.' }); // Updated message
    }
});

module.exports = router;
