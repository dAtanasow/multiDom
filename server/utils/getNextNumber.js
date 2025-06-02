const Counter = require("../models/Counter");

async function getNextNumber(name) {
    const counter = await Counter.findOneAndUpdate(
        { name },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );

    return counter.value;
}

module.exports = getNextNumber;
