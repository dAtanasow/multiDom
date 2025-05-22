const mongoose = require('mongoose');

module.exports = () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("❌ MONGO_URI is not defined in environment variables.");
    }

    return mongoose.connect(mongoUri)
        .then(() => console.log("✅ Свързано с MongoDB"))
        .catch(err => {
            console.error("❌ Грешка при свързване към MongoDB:", err);
            throw err;
        });
};