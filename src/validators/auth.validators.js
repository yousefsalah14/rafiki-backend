const { body, param } = require('express-validator')
const {
   handleValidationErrors,
   strict,
   password,
} = require('./_common/base.validators')

exports.register = [
   body('UserName')
      .isString()
      .withMessage('username must be a string')
      .isLength({ min: 3, max: 50 })
      .withMessage('username must be 3-50 characters'),

   password(body('Password')),

   body('Email').isEmail().withMessage('invalid email'),
   body('Role_Id').isInt().withMessage('invalid role id'),
   body('Date_Of_Birth').isDate().withMessage('invalid date of birth'),
   body('FirstName')
      .isString()
      .withMessage('FirstName must be a string')
      .isLength({ min: 3, max: 50 })
      .withMessage('FirstName must be 3-50 characters'),
   body('LastName')
      .isString()
      .withMessage('LastName must be a string')
      .isLength({ min: 3, max: 50 })
      .withMessage('LastName must be 3-50 characters'),

   handleValidationErrors,
   strict,
]

exports.login = [
   body('UserName')
      .isString()
      .withMessage('username must be a string')
      .isLength({ min: 3, max: 50 }),
   body('Password')
      .isString()
      .isLength({ max: 50 })
      .withMessage('password must be a string and less than 50 characters'),
   handleValidationErrors,
   strict,
]

exports.sendResetPasswordEmail = [
   body('Email').isEmail().withMessage('invalid email'),
   handleValidationErrors,
   strict,
]

exports.changePassword = [
   param('token').isString().withMessage('invalid token'),
   password(body('Password')),
   handleValidationErrors,
   strict,
]
