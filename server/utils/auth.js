const tokenBlacklistModel = require("../models/tokenBlacklistModel");
const userModel = require("../models/userModel");
const { verifyToken } = require('../utils/jwt');

function auth(redirectUnauthenticated = true) {
    return async function (req, res, next) {

        if (req.headers.upgrade === 'websocket') {
            return next();
        }

        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            if (redirectUnauthenticated) {
                return res.status(401).send({ message: 'JWT token must be provided' });
            } else {
                return next();
            }
        }

        try {
            const data = await verifyToken(token);

            const blacklistedToken = await tokenBlacklistModel.findOne({ token })

            if (blacklistedToken) {
                throw new Error('blacklisted token');
            }
            const user = await userModel.findById(data._id);;
            if (!user) {
                throw new Error('User not found');
            }

            req.user = user;
            req.isLogged = true;
            next();

        } catch (err) {
            if (!redirectUnauthenticated) {
                return next();
            }

            let message = 'Invalid token!';

            if (err.name === 'TokenExpiredError') {
                message = 'Your session has expired. Please log in again.';
            } else if (err.name === 'JsonWebTokenError') {
                message = 'Invalid token. Please log in again.';
            } else {
                const errorMessages = {
                    'blacklisted token': 'This token has been blacklisted.',
                    'User not found': 'User does not exist.',
                    'jwt must be provided': 'Authentication token is required.',
                };
                message = errorMessages[err.message] || message;
            }

            console.error(err);
            return res.status(401).send({ message });
        }
    };
}

module.exports = auth;