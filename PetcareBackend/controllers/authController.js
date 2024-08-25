const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { error } = require('console');

exports.signup = async (req, res) => {
    try {
        const { username, email, address, mobileNumber, password } = req.body;
        const newUser = new User({ username, email, address, mobileNumber, password });

        await newUser.save(); // Save the new user using async/await
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error(error);
        res.status(500).json({ error: 'Error registering new user.' });
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }); // Find the user by email

        if (!user) {
            return res.status(404).json({message: 'No user found.'});
        }

        const passwordIsValid = await user.comparePassword(req.body.password); // Compare password
        if (!passwordIsValid) {
            return res.status(401).json({message: 'Invalid password.'});
        }

        const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({ auth: true, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on the server.'});
    }
};
