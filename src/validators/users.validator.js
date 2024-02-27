const { body, param, query } = require('express-validator')
const {
    handleValidationErrors,
    strict,
    password
} = require('./_common/base.validators')

exports.addAlumni = [
    body('UserName')
        .isString().withMessage('UserName must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('UserName must be 3-50 characters'),
    password(body('Password')),
    body('Email').isEmail().withMessage('invalid email'),
    body('National_Id')
        .isInt()
        .withMessage('National Id must be an integer')
        .matches('^(2|3)[0-9][0-9][0-1][0-9][0-3][0-9](01|02|03|04|11|12|13|14|15|16|17|18|19|21|22|23|24|25|26|27|28|29|31|32|33|34|35|88)\d\d\d\d\d$')
        .withMessage('invalid input'),
    handleValidationErrors,
    strict
]

exports.addStudent = [
    body('UserName')
        .isString().withMessage('UserName must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('UserName must be 3-50 characters'),
    password(body('Password')),
    body('Email').isEmail().withMessage('invalid email'),
    body('National_Id')
        .isInt()
        .withMessage('National Id must be an integer')
        .matches('^(2|3)[0-9][0-9][0-1][0-9][0-3][0-9](01|02|03|04|11|12|13|14|15|16|17|18|19|21|22|23|24|25|26|27|28|29|31|32|33|34|35|88)\d\d\d\d\d$')
        .withMessage('invalid input'),
    body('Academic_Id').isInt().withMessage('Academic Id must be an integer'),
    handleValidationErrors,
    strict
]

exports.addHR = [
    body('UserName')
        .isString().withMessage('UserName must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('UserName must be 3-50 characters'),
    password(body('Password')),
    body('Email').isEmail().withMessage('invalid email'),
    body('FirstName')
        .isString().withMessage('FirstName must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('FirstName must be 3-50 characters'),
    body('LastName')
        .isString().withMessage('LastName must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('LastName must be 3-50 characters'),
    handleValidationErrors,
    strict
]

exports.addProfessor = [
    body('UserName')
        .isString().withMessage('UserName must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('UserName must be 3-50 characters'),
    password(body('Password')),
    body('Email').isEmail().withMessage('invalid email'),
    handleValidationErrors,
    strict
]

exports.checkNationalIdExists = [
    body('NID')
        .isInt()
        .withMessage('National Id must be an integer')
        .matches('^(2|3)[0-9][0-9][0-1][0-9][0-3][0-9](01|02|03|04|11|12|13|14|15|16|17|18|19|21|22|23|24|25|26|27|28|29|31|32|33|34|35|88)\d\d\d\d\d$')
        .withMessage('invalid input'),
    handleValidationErrors,
    strict
]

exports.checkEmailExists = [
    body('Email').isEmail().withMessage('invalid email'),
    handleValidationErrors,
    strict
]

exports.checkUserNameExists = [
    body('UserName')
        .isString().withMessage('UserName must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('UserName must be 3-50 characters'),
    handleValidationErrors,
    strict
]

exports.checkAcademicIdExists = [
    body('Academic_Id').isInt().withMessage('Academic Id must be an integer'),
    handleValidationErrors,
    strict
]

exports.updatePhone = [
    body('Phone').isInt().withMessage('phone must be integer')
    .matches('^(01|00201)[0-9]{9}$').withMessage('invalid input'),
    handleValidationErrors,
    strict
]

exports.updateAbout = [
    body('About')
        .isString().withMessage('About must be a string'),
    handleValidationErrors,
    strict
]

exports.updateCountry = [
    body('Country')
        .isString().withMessage('Country must be a string'),
    handleValidationErrors,
    strict
]

exports.updateName = [
    body('FirstName')
        .isString().withMessage('FirstName must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('FirstName must be 3-50 characters'),
    body('LastName')
        .isString().withMessage('LastName must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('LastName must be 3-50 characters'),
    handleValidationErrors,
    strict
]
