function errorHandler(err, req, res, next) {
    if (res.headersSent) return;

    const statusCode = err.status || 500;
    const message = statusCode === 500
        ? 'Internal server error.'
        : err.message || 'Something went wrong.';

    const errorResponse = {
        success: false,
        message,
        ...(err.code && { code: err.code }),
        ...(process.env.NODE_ENV === 'development' && { error: err.stack }),
    };

    res.setHeader('Content-Type', 'application/json');
    res.status(statusCode).json(errorResponse);
}

module.exports = {
    errorHandler
}