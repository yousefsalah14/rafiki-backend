const { validationResult, matchedData, body } = require('express-validator');
const ErrorBuilder = require('../../utils/error.builder');

exports.handleValidationErrors = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new ErrorBuilder({
      message: 'validation failed',
      statusCode: 422,
      code: 'VALIDATION_FAILED',
      data: errors.array(),
    });

    return next(error);
  }

  next();
};

exports.strict = (req, _res, next) => {
  req.body = matchedData(req, {
    locations: ['body'],
    onlyValidData: true,
    includeOptionals: true,
  });

  req.params = matchedData(req, {
    locations: ['params'],
    onlyValidData: true,
    includeOptionals: true,
  });

  req.query = matchedData(req, {
    locations: ['query'],
    onlyValidData: true,
    includeOptionals: true,
  });
  next();
};

// password 8-55 chars 1 number 1 uppercase 1 lowercase
exports.password = (field) => {
  return field
    .isLength({ min: 8, max: 55 })
    .withMessage('password must be 8-55 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'password must contain at least 1 number, 1 uppercase and 1 lowercase letter',
    );
};

exports.isAuthorized = (message = 'session is required') => {
  return body('session').exists().withMessage(message);
};
