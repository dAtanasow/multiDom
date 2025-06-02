class CustomError extends Error {
    constructor(message, status = 500, code = null) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError;