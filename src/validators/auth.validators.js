const { body, param } = require('express-validator')
const { handleValidationErrors, strict, password } = require('./_common/base.validators')

exports.getAllSessions = [strict]


exports.register = [
    body('UserName').isString().isLength({ min: 3, max: 50 }),  
    body('Password').isString().isLength({ min: 8, max: 50 }),
    body('Email').isEmail(),
    body('Role_Id').isInt(),
    body('Date_Of_Birth').isDate(),
    body('FirstName').isString().isLength({ min: 3, max: 50 }),
    body('LastName').isString().isLength({ min: 3, max: 50 }),
    

   handleValidationErrors,
   strict,
]

exports.login = [
    body('UserName').isString().isLength({ min: 3, max: 50 }),
    body('Password').isString().isLength({ min: 8, max: 50 }),
    handleValidationErrors,
    strict,
]

exports.sendResetPasswordEmail = [
    body('Email').isEmail(),
    handleValidationErrors,
    strict,
]

exports.changePassword = [
    param('token').isString(),
    password(body('Password')),
    handleValidationErrors,
    strict,
]