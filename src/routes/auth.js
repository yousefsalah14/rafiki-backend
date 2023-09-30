const router = require('express').Router();
const authController = require('../controllers/authController');
const { isAuthorized } = require('../middlewares/Auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/status', isAuthorized, authController.isLoggedIn);
router.get('/logout', isAuthorized, authController.logout);

module.exports = router;
