const Pet = require('../models/pet');
const jwt = require('jsonwebtoken');
const config = require('../config');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for image storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = './uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${path.basename(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
}).single('image');

exports.addPet = (req, res) => {

    const token = req.headers['x-access-token'];
    console.log('Received token:', token); // Log the token

    if (!token) return res.status(401).json({ message: 'No token provided.' });

    try {
        const decoded = jwt.verify(token, config.secret);
        console.log('Decoded token:', decoded); // Debugging line
    } catch (err) {
        console.error('Token verification error:', err); // More specific error handling
        if (err.name === 'JsonWebTokenError') {
            return res.status(500).json({ error: 'Failed to authenticate token.' });
        }
        return res.status(500).json({ error: 'Error verifying token.' });
    }

    upload(req, res, async (err) => {
        if (err) {
            console.error('Error uploading image:', err);
            return res.status(500).json({ error: 'Error uploading image.' });
        }

        const token = req.headers['x-access-token'];
        if (!token) return res.status(401).json({ message: 'No token provided.' });

        try {
            const decoded = jwt.verify(token, config.secret);

            // Add the console log here to see the received data
            console.log('Received data:', req.body);

            const newPet = new Pet({
                owner: decoded.id,
                petName: req.body.petName,
                type: req.body.type,
                breed: req.body.breed,
                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
                color: req.body.color,
                imagePath: req.file ? req.file.path : null
            });

            await newPet.save();
            res.status(201).json({ message: 'Pet added successfully.' });
            
        } catch (err) {
            console.error('Error:', err);
            if (err.name === 'JsonWebTokenError') {
                return res.status(500).json({ error: 'Failed to authenticate token.' });
            }
            res.status(500).json({ error: 'Error adding pet.' });
        }
    });
};

// Add other methods like viewPets, updatePet, and deletePet as needed


// View Pets
exports.viewPets = async (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ message: 'No token provided.' });

    try {
        const decoded = jwt.verify(token, config.secret);
        const pets = await Pet.find({ owner: decoded.id });
        

        res.status(200).json(pets);
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(500).json({ message: 'Failed to authenticate token.' });
        }
        res.status(500).json({ message: 'Error finding pets.' });
    }
};

// Update Pet
exports.updatePet = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Error uploading image:', err);
            return res.status(500).json({ error: 'Error uploading image.' });
        }

        const token = req.headers['x-access-token'];
        if (!token) return res.status(401).json({ message: 'No token provided.' });

        try {
            const decoded = jwt.verify(token, config.secret);
            console.log('Decoded token:', decoded);

            // Log the ID from params
            console.log('Pet ID from params:', req.params.id);

            // Prepare update fields
            const updateFields = {
                petName: req.body.petName,
                type: req.body.type,
                breed: req.body.breed,
                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
                color: req.body.color,
                imagePath: req.file ? req.file.path : undefined // Update image only if a new one is uploaded
            };

            // Remove any fields with undefined values
            Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);

            const updatedPet = await Pet.findByIdAndUpdate(
                req.params.id,
                updateFields,
                { new: true, runValidators: true }
            );

            if (!updatedPet) {
                return res.status(404).json({ message: 'Pet not found.' });
            }

            res.status(200).json({ message: 'Pet updated successfully.', pet: updatedPet });
        } catch (err) {
            console.error("Error:", err);
            if (err.name === 'JsonWebTokenError') {
                return res.status(500).json({ error: 'Failed to authenticate token.' });
            }
            res.status(500).json({ error: 'Error updating pet.' });
        }
    });
};




// Delete Pet
exports.deletePet = async (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ message: 'No token provided.' });

    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Failed to authenticate token.' });

        try {
            const pet = await Pet.findOneAndDelete({ _id: req.params.id, owner: decoded.id });

            if (!pet) {
                return res.status(404).json({ message: 'Pet not found.' });
            }

            res.status(200).json({ message: 'Pet deleted successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting pet.' });
        }
    });
};
