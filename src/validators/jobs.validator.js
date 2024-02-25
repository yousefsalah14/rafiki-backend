const { body, param } = require('express-validator')
const {
    handleValidationErrors,
    strict,
} = require('./_common/base.validators')

exports.addJobCategory = [
    body('Job_Category_Name')
        .isString()
        .withMessage('category name must be a string'),
    handleValidationErrors,
    strict
]