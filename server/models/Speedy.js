const mongoose = require("mongoose");

const officeSchema = new mongoose.Schema({
    code: { type: String },
    name: { type: String, required: true, },
    address: { type: String, required: true, }
});

const citySchema = new mongoose.Schema({
    city: { type: String, required: true },
    offices: [officeSchema]
});

module.exports = mongoose.model("Speedy", citySchema, "speedy");
