const { body, param } = require('express-validator');
const { handleValidationErrors, strict } = require('./_common/base.validators');
const { isAuthorized } = require('./_common/base.validators');
exports.addSkill = [
  isAuthorized(),
  body('Skill_Name')
    .isString()
    .withMessage('Skill Name must be a string')
    .isLength({ min: 3, max: 50 })
    .withMessage('Skill Name must be 3-50 characters'),
  handleValidationErrors,
  strict,
];

exports.updateSkill = [
  isAuthorized(),
  param('id').isInt().withMessage('invalid skill id'),
  body('Skill_Name')
    .isString()
    .withMessage('Skill Name must be a string')
    .isLength({ min: 3, max: 50 })
    .withMessage('Skill Name must be 3-50 characters'),
  handleValidationErrors,
  strict,
];

exports.deleteSkill = [
  isAuthorized(),
  param('id').isInt().withMessage('invalid skill id'),
  handleValidationErrors,
  strict,
];
