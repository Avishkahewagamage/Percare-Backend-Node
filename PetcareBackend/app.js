const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors'); // Importing CORS

const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const reminderRoutes = require('./routes/reminderRoutes'); // Import reminder route

const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware for parsing request bodies
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use('/uploads', express.static('uploads')); // Serve static files

// Route handlers
app.use('/auth', authRoutes);
app.use('/pets', petRoutes);
app.use('/api', reminderRoutes); // Use reminder routes

// Connect to MongoDB
mongoose.connect(config.database)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Connection error', err);
    });

module.exports = app;
