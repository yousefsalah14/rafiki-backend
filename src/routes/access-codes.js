const router = require('express').Router();
const demoCodesController = require('../controllers/demoCodesControllers');
const { isAdmin } = require('../middlewares/Auth');
const adminCheck = require('../middlewares/isAdmin');

router.post('/access-codes', isAdmin, adminCheck, demoCodesController.createDemoCode);
router.get('/access-codes/:id', isAdmin, demoCodesController.getDemoCode);
router.get('/access-codes', isAdmin, demoCodesController.getDemoCodes);
router.put('/access-codes/:id', isAdmin, demoCodesController.updateDemoCode);
router.put('/access-codes/status/:id', isAdmin, demoCodesController.updateDemoCode);
router.delete('/access-codes/:id', isAdmin, demoCodesController.deleteDemoCode);
// check if access code is valid
router.post('/access-codes/verify', demoCodesController.verifyDemoCode);

module.exports = router;
