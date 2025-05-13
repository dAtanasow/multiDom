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
    companyName: { type: String },
    bulstat: { type: String },
    vatNumber: { type: String },
    mol: { type: String },
    useInvoice: { type: Boolean, default: false },
    items: [
        {
            productId: { type: String, required: true },
            name: { type: String },
            price: { type: Number },
            quantity: { type: Number },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", orderSchema, "orders");