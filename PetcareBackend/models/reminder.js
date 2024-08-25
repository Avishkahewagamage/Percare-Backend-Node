// models/reminder.js
const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true }, // Store date as string in 'YYYY-MM-DD' format
    time: { type: String, required: true }, // Store time as string in 'HH:mm' format
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reminder', ReminderSchema);
