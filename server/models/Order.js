const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String },
    comment: { type: String },
    office: {
        name: { type: String },
        address: { type: String },
        city: { type: String },
        courierName: { type: String }
    },
    invoice: {
        useInvoice: { type: Boolean, default: false },
        companyName: { type: String },
        bulstat: { type: String },
        vatNumber: { type: String },
        mol: { type: String }
    },
    items: [
        {
            productId: { type: String, required: true },
            name: { type: String },
            price: { type: Number },
            quantity: { type: Number },
        },
    ],
    status: {
        type: String,
        enum: ['new', 'pending', 'completed', "canceled"],
        default: 'new'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", orderSchema, "orders");