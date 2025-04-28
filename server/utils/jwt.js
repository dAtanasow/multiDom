const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

function createToken(data) {
    return jwt.sign({ _id: data._id }, secret, { expiresIn: '1d' });
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = {
    createToken,
    verifyToken
}