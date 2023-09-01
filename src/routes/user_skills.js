const router = require('express').Router();
const { isAuthorized } = require('../middlewares/Auth');
const userSkillsController = require('../controllers/userSkillsController');

router.get('/', isAuthorized, userSkillsController.getAllUserSkills);

router.post('/', isAuthorized, userSkillsController.createUserSkill);

router.put('/:id', isAuthorized, userSkillsController.updateUserSkill);

router.delete('/:id', isAuthorized, userSkillsController.deleteUserSkill);

module.exports = router;
