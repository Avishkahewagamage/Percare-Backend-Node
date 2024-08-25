const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    petName: String,
    type: String,
    breed: String,
    dateOfBirth: String,
    gender: String,
    color: String, // Added color field
    imagePath: String // Added imagePath field to store the image location
});

module.exports = mongoose.model('Pet', PetSchema);
