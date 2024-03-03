const router = require('express').Router();
const user_util = require('../utils/user_util');
const admin_util = require('../utils/admin_util');
const { isAdmin } = require('../middlewares/Auth');
const util = require('../utils/util');
const adminCheck = require('../middlewares/isAdmin');
router.post('/create', adminCheck, async (req, res, next) => {
  try {
    const { UserName, Password, Email, National_Id } = req.body;
    if (!UserName || !Password || !Email || !National_Id) {
      res
        .status(400)
        .send({ success: false, message: 'Missing required fields.' });
      return;
    }
    const emailExists = await user_util.checkEmailExists(Email);
    if (emailExists) {
      res
        .status(400)
        .send({ success: false, message: 'Email already exists.' });
      return;
    }
    await admin_util.addAdmin({ UserName, Password, Email, National_Id });
    res
      .status(201)
      .send({ success: true, message: 'Admin created successfully.' });
  } catch (err) {
    next(err);
  }
});

router.get('/get', isAdmin, adminCheck, async (req, res, next) => {
  try {
    const admin = await admin_util.getAdmin(req.body.session.UserName);
    res.status(200).send({ success: true, admin: admin });
  } catch (err) {
    next(err);
  }
});

router.delete('/clear_tables', adminCheck, async (req, res, next) => {
  try {
    await util.clearTables();
    res
      .status(200)
      .send({ success: true, message: 'Tables cleared successfully.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
