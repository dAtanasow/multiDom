import jwt from 'jsonwebtoken';

const accessSecret = process.env.JWT_ACCESS_SECRET || 'AccessSecret123';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'RefreshSecret123';

export function createAccessToken(data) {
    return jwt.sign({ _id: data._id }, accessSecret, { expiresIn: '15m' }); // валиден 15 мин
}

export function createRefreshToken(data) {
    return jwt.sign({ _id: data._id }, refreshSecret, { expiresIn: '7d' }); // валиден 7 дни
}

export function verifyAccessToken(token) {
    return jwt.verify(token, accessSecret);
}

export function verifyRefreshToken(token) {
    return jwt.verify(token, refreshSecret);
}
