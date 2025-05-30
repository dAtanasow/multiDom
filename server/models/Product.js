const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productNumber: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    manufacturer: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    unitCount: {
        type: Number,
    },
    unitType: {
        type: String,
    },
    images: {
        type: [String],
    },
    originCountry: {
        type: String,
    },
    tags: {
        type: [String],
        default: [],
    },
    averageRating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
