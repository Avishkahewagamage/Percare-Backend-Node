const Seller = require('../models/seller');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.signup = async (req, res) => {
    const { username, email, password, address, mobileNumber } = req.body;
    try {
        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) return res.status(400).json({ message: 'Email already in use.' });

        const newSeller = new Seller({ username, email, password, address, mobileNumber });
        await newSeller.save();
        res.status(201).json({ message: 'Seller registered successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const seller = await Seller.findOne({ email });
        if (!seller) return res.status(404).json({ message: 'Seller not found.' });

        const isMatch = await seller.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid password.' });

        const token = jwt.sign({ id: seller._id }, config.jwtSecret, { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};
