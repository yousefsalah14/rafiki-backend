const router = require('express').Router();
const authController = require('../controllers/authController');
const { isAuthorized } = require('../middlewares/Auth');
const demoValidation = require('../middlewares/demoValidation');
const validator = require('../validators/auth.validators');

router.post('/register', validator.register, demoValidation, authController.register);
router.post('/login', validator.login, authController.login);
router.get('/status',isAuthorized, authController.isLoggedIn);
router.get('/logout', isAuthorized, authController.logout);
router.post('/reset_password', validator.sendResetPasswordEmail, authController.sendResetPasswordEmail);
router.post('/reset_password/:token', validator.changePassword, authController.changePassword);
module.exports = router;
