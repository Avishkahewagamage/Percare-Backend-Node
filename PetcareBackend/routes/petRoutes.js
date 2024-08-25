const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');

// Route handlers
router.post('/add', petController.addPet);
router.get('/view', petController.viewPets);
router.put('/update/:id', petController.updatePet);
router.delete('/delete/:id', petController.deletePet);

module.exports = router;
