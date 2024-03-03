const router = require('express').Router();
const {
  isHR,
  isAlumniOrStudent,
  isAuthorized,
  isAdmin,
} = require('../middlewares/Auth');
const jobsController = require('../controllers/jobsController');
const validator = require('../validators/jobs.validator');

router.post(
  '/add-job-category',
  isHR,
  validator.addJobCategory,
  jobsController.addJobCategory,
);

router.post(
  '/add-job-post',
  isHR,
  validator.addJobPost,
  jobsController.addJobPost,
);

router.get('/get-job-categories', isHR, jobsController.getAllJobCategories);

router.get(
  '/get-job-post/:Job_Id',
  isAuthorized,
  validator.getJobPostById,
  jobsController.getJobPostById,
);

router.get(
  '/get-job-posts',
  isAuthorized,
  validator.getJobPosts,
  jobsController.getJobPosts,
);

router.post(
  '/add-job-application',
  isAlumniOrStudent,
  validator.postJobApplication,
  jobsController.postJobApplication,
);

router.get(
  '/user-job-applications',
  isAlumniOrStudent,
  jobsController.getJobApplicationsByUser,
);

router.get(
  '/job-applications/:Job_Id',
  isHR,
  validator.getJobApplicationsByJob,
  jobsController.getJobApplicationsByJob,
);

router.put(
  '/update-job-application-status',
  isHR,
  validator.updateJobApplicationStatus,
  jobsController.updateJobApplicationStatus,
);

router.delete(
  '/delete-job-post/:Job_Id',
  isHR,
  validator.deleteJobPost,
  jobsController.deleteJobPost,
);

router.delete(
  '/delete-job-category/:Job_Category_Id',
  isAdmin,
  validator.deleteJobCategory,
  jobsController.deleteJobCategory,
);

module.exports = router;
