const { body, param, query } = require('express-validator');
const { handleValidationErrors, strict } = require('./_common/base.validators');
const { isAuthorized } = require('./_common/base.validators');
exports.addJobCategory = [
  isAuthorized(),
  body('Job_Category_Name')
    .isString()
    .withMessage('category name must be a string'),
  handleValidationErrors,
  strict,
];

exports.addJobPost = [
  isAuthorized(),
  body('Job_Title')
    .isString()
    .withMessage('Job title must be a string')
    .notEmpty()
    .withMessage('This field is required'),
  body('Description')
    .isString()
    .withMessage('Description must be a string')
    .notEmpty()
    .withMessage('This field is required'),
  body('Company_Name')
    .isString()
    .withMessage('Company name must be a string')
    .notEmpty()
    .withMessage('This field is required'),
  body('Company_Logo').isURL().withMessage('input must be image URL'),
  body('Company_Size')
    .isString()
    .withMessage('Company size must be a string')
    .notEmpty()
    .withMessage('This field is required'),
  body('Company_Email').isEmail().withMessage('invalid email'),
  body('External_Link').isURL().withMessage('invalid link'),
  body('Location')
    .isString()
    .withMessage('Location must be a string')
    .notEmpty()
    .withMessage('This field is required'),
  body('Application_Deadline')
    .isString()
    .withMessage('Deadline must be a string'), //.matches([\s\S]*(\d{2})-(\d{2})[\s\S]*(\d{2}):(\d{2})[\s\S]*)
  body('Job_Category_Id')
    .isInt()
    .withMessage('category id must be an integer')
    .notEmpty()
    .withMessage('This field is required'),
  body('Salary').isNumeric().withMessage('Salary must be a number'),
  body('isInternship')
    .isBoolean()
    .withMessage('is Internship field must be boolean')
    .notEmpty()
    .withMessage('This field is required'),
  body('Duration')
    .optional()
    .custom((value) => typeof value === 'string' || value === null)
    .withMessage('Job duration must be a string or null'),
  body('Job_Type')
    .isString()
    .withMessage('Job type must be a string')
    .notEmpty()
    .withMessage('This field is required'),
  body('Education_Level')
    .isString()
    .withMessage('Education level must be a string'),
  body('Job_Skills')
    .isArray({ min: 1 })
    .withMessage('Job skills must be an array')
    .notEmpty()
    .withMessage('This field is required'),
  body('Job_Requirements')
    .isString()
    .withMessage('Job Requirements must be a string')
    .notEmpty()
    .withMessage('This field is required'),
  body('Job_Time').isString().withMessage('Job time must be a string'),
  handleValidationErrors,
  strict,
];

exports.getJobPostById = [
  isAuthorized(),
  param('Job_Id').isInt().withMessage('job id must be an integer'),
  handleValidationErrors,
  strict,
];

exports.getJobPosts = [
  isAuthorized(),
  query('page').isInt().withMessage('page number must be an integer'),
  query('limit').isInt().withMessage('limit must be an integer'),
  handleValidationErrors,
  strict,
];

exports.postJobApplication = [
  isAuthorized(),
  body('Job_Id').isInt().withMessage('job id must be an integer'),
  body('Cover_Letter').isString().withMessage('Cover letter must be a string'),
  body('Resume').isURL().withMessage('input must be URL'),
  handleValidationErrors,
  strict,
];

exports.getJobApplicationsByJob = [
  isAuthorized(),
  param('Job_Id').isInt().withMessage('job id must be integer'),
  handleValidationErrors,
  strict,
];

exports.updateJobApplicationStatus = [
  isAuthorized(),
  body('Job_Application_Id')
    .isInt()
    .withMessage('Job application id must be an integer'),
  body('Status').isString().withMessage('Status must be a string'),
  handleValidationErrors,
  strict,
];

exports.deleteJobPost = [
  isAuthorized(),
  param('Job_Id').isInt().withMessage('Job id must be an integer'),
  handleValidationErrors,
  strict,
];

exports.deleteJobCategory = [
  isAuthorized(),
  param('Job_Category_Id')
    .isInt()
    .withMessage('Job Category id must be an integer'),
  handleValidationErrors,
  strict,
];
