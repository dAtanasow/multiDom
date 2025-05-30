const Counter = require("../models/Counter");

async function getNextProductNumber() {
    const counter = await Counter.findOneAndUpdate(
        { name: "productNumber" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );

    return counter.value.toString();
}

module.exports = getNextProductNumber;