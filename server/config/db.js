const mongoose = require('mongoose');

module.exports = () => {
    return mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('✅ Свързано с MongoDB'))
        .catch((err) => console.error('❌ Грешка при свързване към MongoDB:', err));
};
