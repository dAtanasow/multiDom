const TokenBlacklist = require("../models/tokenBlacklist");
const User = require("../models/User");
const { verifyAccessToken } = require("../utils/jwt");

function auth(redirectUnauthenticated = true) {
    return async function (req, res, next) {
        try {

            if (req.headers.upgrade === 'websocket') {
                return next();
            }
            const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

            if (!token) {
                if (redirectUnauthenticated) {
                    return res.status(401).send({ message: 'JWT token must be provided' });
                } else {
                    req.user = null;
                    req.isLogged = false;
                    return next();
                }
            }

            const blacklisted = await TokenBlacklist.findOne({ token });
            if (blacklisted) {
                if (redirectUnauthenticated) {
                    return res.status(401).json({ message: "This token has been blacklisted." });
                } else {
                    req.user = null;
                    req.isLogged = false;
                    return next();
                }
            }

            const payload = await verifyAccessToken(token);

            const user = await User.findById(payload._id);
            if (!user) {
                return res.status(401).json({ message: "User not found." });
            }

            req.user = user;
            req.isLogged = true;
            return next();


        } catch (err) {
            console.error("AUTH ERROR:", err);

            const tokenErrorMessages = {
                TokenExpiredError: "Сесията е изтекла. Моля, влезте отново.",
                JsonWebTokenError: "Невалиден токен. Моля, влезте отново.",
            };

            const message =
                tokenErrorMessages[err.name] ||
                err.message ||
                "Проблем с удостоверяването.";

            if (redirectUnauthenticated) {
                return res.status(401).json({ message });
            } else {
                req.user = null;
                req.isLogged = false;
                return next();
            }
        }
    };
}

module.exports = auth;