const Product = require('../models/product');
const jwt = require('jsonwebtoken');
const config = require('../config');
const path = require('path');
const fs = require('fs');

exports.addProduct = (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ message: 'No token provided.' });

    jwt.verify(token, config.jwtSecret, async (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Failed to authenticate token.' });

        const { itemName, itemDescription, itemPrice } = req.body;
        const itemImage = req.file ? req.file.filename : '';

        try {
            const newProduct = new Product({
                seller: decoded.id,
                itemName,
                itemDescription,
                itemPrice,
                itemImage
            });
            await newProduct.save();
            res.status(201).json({ message: 'Product added successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'Error adding product.' });
        }
    });
};

exports.viewProducts = (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ message: 'No token provided.' });

    jwt.verify(token, config.jwtSecret, async (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Failed to authenticate token.' });

        try {
            const products = await Product.find({ seller: decoded.id });
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching products.' });
        }
    });
};

// Update a product
exports.updateProduct = (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ message: 'No token provided.' });

    jwt.verify(token, config.jwtSecret, async (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Failed to authenticate token.' });

        const { productId } = req.params;
        const { itemName, itemDescription, itemPrice } = req.body;
        const itemImage = req.file ? req.file.filename : '';

        try {
            const updateFields = {
                itemName,
                itemDescription,
                itemPrice
            };
            
            if (itemImage) {
                updateFields.itemImage = itemImage;
            }

            const updatedProduct = await Product.findOneAndUpdate(
                { _id: productId, seller: decoded.id },
                { $set: updateFields },
                { new: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({ error: 'Product not found or unauthorized.' });
            }

            res.status(200).json({ message: 'Product updated successfully.', product: updatedProduct });
        } catch (error) {
            res.status(500).json({ error: 'Error updating product.' });
        }
    });
};

// Delete a product
exports.deleteProduct = (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ message: 'No token provided.' });

    jwt.verify(token, config.jwtSecret, async (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Failed to authenticate token.' });

        const { productId } = req.params;

        try {
            const product = await Product.findOneAndDelete({ _id: productId, seller: decoded.id });

            if (!product) {
                return res.status(404).json({ error: 'Product not found or unauthorized.' });
            }

            // Optionally, delete the associated image file from the filesystem
            if (product.itemImage) {
                const imagePath = path.join(__dirname, '../uploads', product.itemImage);
                fs.unlink(imagePath, (err) => {
                    if (err) console.error('Error deleting image file:', err);
                });
            }

            res.status(200).json({ message: 'Product deleted successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting product.' });
        }
    });
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'username'); // Optionally populate seller information
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products.' });
    }
};

