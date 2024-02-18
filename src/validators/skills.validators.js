const { body, param } = require('express-validator')
const { handleValidationErrors, strict } = require('./_common/base.validators')

exports.addSkill = [
   body('Skill_Name')
      .isString()
      .withMessage('Skill Name must be a string')
      .isLength({ min: 3, max: 50 })
      .withMessage('Skill Name must be 3-50 characters'),
   handleValidationErrors,
   strict,
]
