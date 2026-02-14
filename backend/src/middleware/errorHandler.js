/**
 * Normalizes error object (statusCode, message) and forwards to next error handler.
 */
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal server error';
  next(err);
};
