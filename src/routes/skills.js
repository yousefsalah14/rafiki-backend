const router = require('express').Router();
const { isAuthorized, isAdmin } = require('../middlewares/Auth');
const skillsController = require('../controllers/skillsController');
router.get('/', isAuthorized, skillsController.getSkills);

router.post('/', isAuthorized, skillsController.addSkill);

router.put('/:id', isAdmin, skillsController.updateSkill);

router.delete('/:id', isAdmin, skillsController.deleteSkill);


module.exports = router;
