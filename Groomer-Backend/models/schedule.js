const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    groomer: { type: mongoose.Schema.Types.ObjectId, ref: 'Groomer', required: true }, // Updated reference
    schedule: {
        Monday: { type: String },
        Tuesday: { type: String },
        Wednesday: { type: String },
        Thursday: { type: String },
        Friday: { type: String },
        Saturday: { type: String },
        Sunday: { type: String }
    }
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
