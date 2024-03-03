const router = require('express').Router();
const { isAuthorized } = require('../middlewares/Auth');
const userSkillsController = require('../controllers/userSkillsController');
const validator = require('../validators/userSkills.validators');

router.get('/', isAuthorized, userSkillsController.getAllUserSkills);

router.post(
  '/',
  isAuthorized,
  validator.createUserSkill,
  userSkillsController.createUserSkill,
);

router.put(
  '/:id',
  isAuthorized,
  validator.updateUserSkill,
  userSkillsController.updateUserSkill,
);

router.delete(
  '/:id',
  isAuthorized,
  validator.deleteUserSkill,
  userSkillsController.deleteUserSkill,
);

module.exports = router;
