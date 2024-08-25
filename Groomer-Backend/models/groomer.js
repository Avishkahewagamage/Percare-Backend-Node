const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const GroomerSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    specialty: { type: String, required: true },
    password: { type: String, required: true }
});

GroomerSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

GroomerSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Groomer', GroomerSchema);