const { validationResult } = require('express-validator');
const CustomError = require('../utils/CustomError');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMsg = errors.array()[0].msg;
        return next(new CustomError(errorMsg, 400));
    }
    next();
};

module.exports = { validate }