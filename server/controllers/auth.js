const bcrypt = require('bcryptjs');
const User = require('../models/User');
const TokenBlacklist = require('../models/tokenBlacklist');
const CustomError = require('../utils/CustomError');
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const logout = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.cookies.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) {
        return next(new CustomError('Няма предоставен токен за излизане.', 400));
    }
    try {
        await TokenBlacklist.create({ token });

        if (req.cookies.token) {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
            });
        }
        if (req.cookies.refreshToken) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
            });
        }
        res.status(200).json({ message: 'Успешно излязохте от профила.' });
    } catch (error) {
        next(error);
    }
};



const register = async (req, res, next) => {
    const { firstName, lastName, phone, email, password, rePassword } = req.body;

    if (!firstName || !lastName || !phone || !email || !password, !rePassword) {
        return next(new CustomError('Моля, попълнете всички полета.', 400));
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new CustomError('Имейлът вече е регистриран.', 400));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            phone,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const accessToken = createAccessToken(newUser);
        const refreshToken = createRefreshToken(newUser);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дни
        });

        res.status(201).json({
            accessToken,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                phone: newUser.phone,
                email: newUser.email,
                role: newUser.role || "user",
            },
        });
    } catch (err) {
        next(err);
    }
};


const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new CustomError('Моля, въведете имейл и парола.', 400));
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(new CustomError('Имейлът не е регистриран.', 404));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new CustomError('Грешна парола.', 401));
        }

        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дни
        });

        res.status(200).json({
            accessToken,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone || "",
                role: user.role || "user",
            },
        });
    } catch (err) {
        next(err);
    }
};

const editProfile = async (req, res, next) => {
    const userId = req.user?._id;
    const { firstName, lastName, phone, email } = req.body;

    if (!userId) {
        return next(new CustomError("Неавторизиран достъп.", 401));
    }

    if (!firstName || !lastName || !phone || !email) {
        return next(new CustomError("Моля, попълнете всички полета.", 400));
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
        const user = await User.findById(userId);
        if (!user) {
            return next(new CustomError("Потребителят не е намерен.", 404));
        }

        const isSame =
            user.firstName === firstName &&
            user.lastName === lastName &&
            user.phone === phone &&
            user.email === normalizedEmail;

        if (isSame) {
            return res.status(200).json({
                message: "Няма направени промени.",
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role || "user",
                },
            });
        }

        if (normalizedEmail !== user.email) {
            const emailExists = await User.findOne({ email: normalizedEmail });
            if (emailExists && emailExists._id.toString() !== userId.toString()) {
                return next(new CustomError("Имейлът вече се използва от друг потребител.", 400));
            }
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone;
        user.email = normalizedEmail;

        await user.save();

        res.status(200).json({
            message: "Профилът е обновен успешно.",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role || "user",
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
        const accessToken = createAccessToken({ _id: data._id });

        res.status(200).json({ accessToken });
    } catch (err) {
        return next(new CustomError('Невалиден или изтекъл refresh токен.', 401));
    }
};

module.exports = {
    register,
    login,
    logout,
    editProfile,
    refreshAccessToken
}