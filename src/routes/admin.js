const router = require('express').Router();
const user_util = require('../util/user_util');
const admin_util = require('../util/admin_util');
const { isAdmin } = require('../middlewares/Auth');
const tempApiKey = process.env.TEMP_API_KEY;
const util = require('../util/util');
router.post('/create', async (req, res, next) => {
    try {
        if (req.headers.authorization.split(' ')[1] !== tempApiKey) {
            res.status(401).send({ success: false, message: 'Unauthorized.' });
            return;
        }
        const { UserName, Password, Email, National_Id } = req.body;
        if (!UserName || !Password || !Email || !National_Id) {
            res.status(400).send({ success: false, message: 'Missing required fields.' });
            return;
        }
        const emailExists = await user_util.checkEmailExists(Email);
        if (emailExists) {
            res.status(400).send({ success: false, message: 'Email already exists.' });
            return;
        }
        await admin_util.addAdmin({ UserName, Password, Email, National_Id });
        res.status(201).send({ success: true, message: 'Admin created successfully.' });
    } catch (err) {
        next(err);
    }
});

router.get('/get', isAdmin, async (req, res, next) => {
    try {
        const admin = await admin_util.getAdmin(req.session.UserName);
        res.status(200).send({ success: true, admin: admin });
    } catch (err) {
        next(err);
    }
});

router.delete('/clear_tables', async (req, res, next) => {
    try {
        await util.clearTables();
        res.status(200).send({ success: true, message: 'Tables cleared successfully.' });
    } catch (err) {
        next(err);
    }
});


module.exports = router;
