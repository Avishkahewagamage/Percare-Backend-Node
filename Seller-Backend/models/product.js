const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    itemName: { type: String, required: true },
    itemDescription: { type: String, required: true },
    itemPrice: { type: Number, required: true },
    itemImage: { type: String } // Store the filename
});

module.exports = mongoose.model('Product', ProductSchema);
