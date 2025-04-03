// middleware/errorMiddleware.js

// 404 Not Found Middleware
exports.notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  // Global Error Handling Middleware
  exports.errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      message: err.message,
      // Include stack trace only in non-production environments
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  };
  