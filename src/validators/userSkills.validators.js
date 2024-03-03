const { body, param } = require('express-validator');
const { handleValidationErrors, strict } = require('./_common/base.validators');
const { isAuthorized } = require('./_common/base.validators');
exports.createUserSkill = [
  isAuthorized(),
  body('Skill_Id').isInt().withMessage('invalid skill id'),
  body('Rate').isFloat().withMessage('invalid rate'),
  handleValidationErrors,
  strict,
];

exports.updateUserSkill = [
  isAuthorized(),
  param('id').isInt().withMessage('invalid user skill id'),
  body('Rate').isFloat().withMessage('invalid rate'),
  handleValidationErrors,
  strict,
];

exports.deleteUserSkill = [
  isAuthorized(),
  param('id').isInt().withMessage('invalid user skill id'),
  handleValidationErrors,
  strict,
];
