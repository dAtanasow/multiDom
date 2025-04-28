import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import TokenBlacklist from '../models/tokenBlacklist.js';
import CustomError from '../utils/CustomError.js';

export const logout = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return next(new CustomError('Няма предоставен токен за излизане.', 400));
    }

    try {
        await TokenBlacklist.create({ token });
        res.status(200).json({ message: 'Успешно излязохте от профила.' });
    } catch (error) {
        next(error);
    }
};


export const register = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
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
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'Успешна регистрация!' });
    } catch (err) {
        next(err);
    }
};


export const login = async (req, res, next) => {
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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        next(err);
    }
};

