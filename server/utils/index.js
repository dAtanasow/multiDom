const { createToken, verifyToken } = require('./jwt');
const auth = require('./auth');
const errorHandler = require('./errHandler');

jwt = { createToken, verifyToken }

module.exports = {
    jwt,
    auth,
    errorHandler
}