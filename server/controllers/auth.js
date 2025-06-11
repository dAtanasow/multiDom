const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenBlacklist = require('../models/tokenBlacklist');
const CustomError = require("../utils/CustomError");
const { createAccessToken, createRefreshToken, verifyRefreshToken, createEmailConfirmationToken, verifyAccessToken } = require('../utils/jwt');
const Cart = require('../models/Cart');
const { sendRegistrationConfirmationEmail } = require('../utils/email-confirm');

const logout = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.cookies.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) {
        return res.status(200).json({ message: "Вече сте излезли." });
    }
    try {
        const exists = await TokenBlacklist.findOne({ token });
        if (exists) {
            return res.status(200).json({ message: "Вече сте излезли." });
        }
        await TokenBlacklist.create({ token });
        if (req.cookies.token) {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
            });
        }
        if (req.cookies.refreshToken) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
            });
        }
        res.status(200).json({ message: 'Успешно излязохте от профила.' });
    } catch (error) {
        next(error);
    }
};

const register = async (req, res, next) => {
    const { firstName, lastName, phone, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new CustomError('Имейлът вече е регистриран.', 400, 'EMAIL_EXISTS'));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            phone,
            email,
            password: hashedPassword,
            emailConfirmed: false,
        });

        await newUser.save(); // ⬅️ Първо записваме потребителя
        await Cart.create({ user: newUser._id, items: [] });

        const confirmToken = createEmailConfirmationToken(newUser);
        const confirmUrl = `https://multidom-460607.web.app/email-confirmed?token=${confirmToken}&email=${encodeURIComponent(email)}`;

        await sendRegistrationConfirmationEmail(email, firstName, confirmUrl);

        res.status(201).json({
            message: "Имейл за потвърждение е изпратен.",
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return next(new CustomError('Грешен имейл или парола', 400));

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return next(new CustomError('Грешен имейл или парола', 400));

        if (!user.emailConfirmed) {
            return next(new CustomError('Имейлът не е потвърден. Провери входящата поща.', 403, 'EMAIL_NOT_CONFIRMED'));
        }

        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            accessToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
};

const refreshAccessToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return next(new CustomError('Refresh токен липсва.', 401));
    }

    try {
        const data = verifyRefreshToken(refreshToken);
        const accessToken = createAccessToken(data);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ accessToken });
    } catch (err) {
        return next(new CustomError('Невалиден или изтекъл refresh токен.', 401));
    }
};

const confirmEmail = async (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(400).json({ message: "Липсващ токен." });
    }
    try {
        const decoded = verifyAccessToken(req.query.token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).json({ message: "Потребителят не е намерен." });
        }

        if (user.emailConfirmed) {
            const accessToken = createAccessToken(user);
            const refreshToken = createRefreshToken(user);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                message: "Имейлът вече беше потвърден.",
                accessToken,
                email: user.email,
            });
        }

        user.emailConfirmed = true;
        await user.save();

        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Имейлът е потвърден успешно.",
            accessToken,
            email: user.email,
        });
    } catch (err) {
        console.error("❌ Email confirmation error:", err);
        return res.status(400).json({ message: "Невалиден или изтекъл токен." });
    }
};

const resendConfirmation = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Няма потребител с този имейл." });
        }

        if (user.emailConfirmed) {
            return res.status(400).json({ message: "Имейлът вече е потвърден." });
        }

        const now = Date.now();
        const lastSent = user.resendTokenSentAt?.getTime() || 0;
        const diffInSeconds = Math.floor((now - lastSent) / 1000);

        if (diffInSeconds < 60) {
            const waitSeconds = 60 - diffInSeconds;
            return res.status(429).json({
                message: `Можеш да изпратиш отново след ${waitSeconds} сек.`,
            });
        }

        const token = createEmailConfirmationToken(user);
        const confirmUrl = `https://multidom-460607.web.app/email-confirmed?token=${token}&email=${user.email}`;
        await sendRegistrationConfirmationEmail(user.email, user.firstName, confirmUrl);

        user.resendTokenSentAt = new Date();
        await user.save();

        res.json({ message: "Изпратихме нов имейл за потвърждение." });
    } catch (err) {
        next(err);
    }
};

const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        res.json({
            _id: req.user._id,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            phone: req.user.phone,
            role: req.user.role,
        });
    } catch (err) {
        console.error("Error getting current user:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    register,
    login,
    logout,
    refreshAccessToken,
    getCurrentUser,
    confirmEmail,
    resendConfirmation
}