const Groomer = require('../models/groomer'); // Updated model path
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.signup = async (req, res) => {
    const { username, email, password, address, mobileNumber, specialty } = req.body;
    try {
        const existingGroomer = await Groomer.findOne({ email });
        if (existingGroomer) return res.status(400).json({ message: 'Email already in use.' });

        const newGroomer = new Groomer({ username, email, password, address, mobileNumber, specialty });
        await newGroomer.save();
        res.status(201).json({ message: 'Groomer registered successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const groomer = await Groomer.findOne({ email });
        if (!groomer) return res.status(404).json({ message: 'Groomer not found.' });

        const isMatch = await groomer.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid password.' });

        const token = jwt.sign({ id: groomer._id }, config.jwtSecret, { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};

// Function to display all groomers' details
exports.getAllGroomers = async (req, res) => {
    try {
        const groomers = await Groomer.find({});
        res.status(200).json(groomers);
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};
