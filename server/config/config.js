const env = process.env.NODE_ENV || 'development';

const config = {
    port: process.env.PORT || 8080,
    dbURL: process.env.MONGO_URI,
    cookieSecret: process.env.COOKIESECRET,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    origin: [
        'http://localhost:5173',
        'https://multidom-460607.web.app'
    ]
};

module.exports = config;
