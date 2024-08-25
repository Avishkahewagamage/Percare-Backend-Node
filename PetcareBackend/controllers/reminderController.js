// controllers/reminderController.js
const Reminder = require('../models/reminder');

// Fetch all reminders
exports.getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find();
        res.json(reminders);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching reminders' });
    }
};

// Add a new reminder
exports.addReminder = async (req, res) => {
    const { name, description, date, time } = req.body;

    try {
        const newReminder = new Reminder({ name, description, date, time });
        await newReminder.save();
        res.status(201).json({ message: 'Reminder added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error adding reminder' });
    }
};

// Update a reminder
exports.updateReminder = async (req, res) => {
    const { id } = req.params;
    const { name, description, date, time } = req.body;

    // Log request details for debugging
    console.log('Updating reminder with ID:', id);
    console.log('Request body:', req.body);

    try {
        // Find and update the reminder
        const updatedReminder = await Reminder.findByIdAndUpdate(
            id,
            { name, description, date, time },
            { new: true, runValidators: true }
        );

        // Check if the reminder was found and updated
        if (!updatedReminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        // Send response
        res.json({ message: 'Reminder updated successfully', reminder: updatedReminder });
    } catch (err) {
        // Detailed error logging
        console.error('Error updating reminder:', err.message);
        res.status(500).json({ error: 'Error updating reminder' });
    }
};



// Delete a reminder
exports.deleteReminder = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedReminder = await Reminder.findByIdAndDelete(id);

        if (!deletedReminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        res.json({ message: 'Reminder deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting reminder' });
    }
};
