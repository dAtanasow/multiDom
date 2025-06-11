const jwt = require('jsonwebtoken');

function createAccessToken(data) {
    return jwt.sign({ _id: data._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

function createRefreshToken(data) {
    return jwt.sign({ _id: data._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

function verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

function verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

function createEmailConfirmationToken(user) {
    return jwt.sign({ _id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' });
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    createEmailConfirmationToken
};