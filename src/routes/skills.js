const router = require('express').Router();
const { isAuthorized, isAdmin } = require('../middlewares/Auth');
const skillsController = require('../controllers/skillsController');
const validator = require('../validators/skills.validators');
router.get('/', isAuthorized, skillsController.getSkills);

router.post('/', isAuthorized, validator.addSkill, skillsController.addSkill);

router.put('/:id', isAdmin, validator.updateSkill, skillsController.updateSkill);

router.delete('/:id', isAdmin, validator.deleteSkill, skillsController.deleteSkill);


module.exports = router;
