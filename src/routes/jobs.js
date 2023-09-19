const router = require('express').Router();
const { isHR, isAlumniOrStudent, isAuthorized } = require('../middlewares/Auth');
const jobsController = require('../controllers/jobsController');

router.post('/add-job-category', isHR, jobsController.addJobCategory);

router.post('/add-job-post', isHR, jobsController.addJobPost);

router.get('/get-job-types', isHR, jobsController.getAllJobTypes);

router.get('/get-job-post/:Job_Id', isAuthorized, jobsController.getJobPostById);

router.get('/get-job-posts', isAuthorized, jobsController.getJobPosts);

router.post('/add-job-application', isAlumniOrStudent, jobsController.postJobApplication);

router.get('/user-job-applications', isAlumniOrStudent, jobsController.getJobApplicationsByUser);

router.get('/job-applications/:Job_Id', isHR, jobsController.getJobApplicationsByJob);

router.put('/update-job-application-status', isHR, jobsController.updateJobApplicationStatus);

router.delete('/delete-job-post/:Job_Id', isHR, jobsController.deleteJobPost);

module.exports = router;
