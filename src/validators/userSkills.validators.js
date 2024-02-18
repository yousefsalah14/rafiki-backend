const { body, param } = require('express-validator')
const { handleValidationErrors, strict } = require('./_common/base.validators')

exports.createUserSkill = [
    body('Skill_Id').isInt().withMessage('invalid skill id'),
    body('Rate').isFloat().withMessage('invalid rate'),
    handleValidationErrors,
    strict,
]