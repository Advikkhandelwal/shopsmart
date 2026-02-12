// Global error handler – must have 4 args so Express treats it as error middleware
function errorHandler(err, req, res, next) {
    const status = err.statusCode || err.status || 500;
    const message = err.message || 'Internal server error';
    if (status === 500) {
        console.error(err);
    }
    res.status(status).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}

module.exports = errorHandler;
