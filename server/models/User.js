const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    role: {
        type: String,
        default: 'user'
    },
    addresses: [
        {
            label: { type: String },
            deliveryMethod: { type: String, enum: ["address", "office"], required: true },
            city: { type: String, required: true },
            address: { type: String },
            office: {
                name: { type: String },
                address: { type: String },
                courierName: { type: String }
            }
        }
    ],
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            default: []
        }
    ],
    emailConfirmed: {
        type: Boolean,
        default: false
    },
    resendTokenSentAt: { type: Date },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;