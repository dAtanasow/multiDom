function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return;
    }

    const statusCode = err.status || 500;
    const message = err.message || 'Something went wrong on the server.';

    console.error(`🔥 Error at ${req.method} ${req.url}`);
    console.error(err.stack);

    res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? 'Internal server error.' : message,
        ...(process.env.NODE_ENV === 'development' && { error: err.stack })
    });
}

module.exports = errorHandler;
