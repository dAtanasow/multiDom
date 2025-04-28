const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        port: process.env.PORT || 3000,
        dbURL: process.env.MONGO_URI || 'mongodb://localhost:27017/МултиДом',
        cookieSecret: process.env.COOKIESECRET,
        jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
        origin: ['http://localhost:5173'],
    },
    production: {
        port: process.env.PORT || 3000,
        dbURL: process.env.DB_URL_CREDENTIALS,
        cookieSecret: process.env.COOKIESECRET,
        jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
        origin: [process.env.FRONTEND_URL],
    }
};

module.exports = config[env];
