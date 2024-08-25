const Doctor = require('../models/doctor'); // Updated model path
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.signup = async (req, res) => {
    const { username, email, password, address, mobileNumber, specialty } = req.body;
    try {
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) return res.status(400).json({ message: 'Email already in use.' });

        const newDoctor = new Doctor({ username, email, password, address, mobileNumber, specialty });
        await newDoctor.save();
        res.status(201).json({ message: 'Doctor registered successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const doctor = await Doctor.findOne({ email });
        if (!doctor) return res.status(404).json({ message: 'Doctor not found.' });

        const isMatch = await doctor.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid password.' });

        const token = jwt.sign({ id: doctor._id }, config.jwtSecret, { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};
