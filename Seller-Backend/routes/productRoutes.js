const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');
const config = require('../config');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
});
const upload = multer({ storage });

// Routes
router.post('/add', upload.single('image'), productController.addProduct);
router.get('/view', productController.viewProducts);

// Update product route
router.put('/update/:productId', upload.single('image'), productController.updateProduct);

// Delete product route
router.delete('/delete/:productId', productController.deleteProduct);

router.get('/all', productController.getAllProducts);


module.exports = router;
