/**
 * @description error builder
 * @param {string} message - Error message
 * @param {number} statusCode - response status code
 * @param {string} code - Error code
 * @returns {Error} - the error object
 * @example ErrorBuilder(<'Invalid email or password', 401, 'INVALID_CREDENTIALS'>)
 */
class ErrorBuilder extends Error {
  constructor({ message, statusCode, code, data }) {
    super();
    this.code = code || null;
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.message = message || 'Internal server error';

    this.data = data || null;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorBuilder;

/*Api Error Codes
 * RESOURCES_NOT_FOUND (any resource not found)
 * ILLEGAL_OPERATION (any illegal operation)
 * INVALID_CREDENTIALS (invalid credentials)
 * VALIDATION_FAILED (validation error)
 */
