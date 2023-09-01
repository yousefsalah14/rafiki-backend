const user_util = require('../utils/user_util');
const path = require('path');
const { sendEmail } = require('../utils/mail_util');
const { FRONTEND_URL } = require('../config/config');

exports.login = async (req, res, next) => {
    try {
        const { UserName, Password } = req.body;
        if (!UserName || !Password) {
            res.status(400).send({ success: false, message: 'Missing credentials.' });
            return;
        }
        const user = await user_util.getUser(UserName);
        if (!user) {
            res.status(404).send({ success: false, message: 'User not found.' });
            return;
        }
        const isMatch = await user_util.comparePassword(Password, user.Password);
        if (!isMatch) {
            res.status(401).send({ success: false, message: 'Invalid credentials.' });
            return
        }
        // console.log(user);
        req.session.RoleName = user.Role.Role_Name;
        req.session.IsLoggedIn = true;
        req.session.User_Id = user.User_Id;
        req.session.UserName = user.UserName;
        // how use the custom field in session 

        res.status(200).send({
            success: true,
            actor: user.Role.Role_Name,
            user_id: user.User_Id,
            user_name: user.UserName,
            sessionId: req.session.id,
            message: 'User logged in successfully.'
        });
    } catch (err) {
        next(err);
    }
};

exports.isLoggedIn = (req, res, next) => {
    try {
        const actor = req.session.RoleName;
        res.status(200).send({ success: true, message: 'User is logged in.', actor });
    } catch (err) {
        next(err);
    }
};

exports.logout = (req, res, next) => {
    try {
        req.session.destroy();
        res.clearCookie('connect.sid');
        const sessionId = req.body.sessionId;
        // destroy session
        req.sessionStore.destroy(sessionId, (err) => {
            if (err) {
                console.error("session err", err);
                res.status(500).send({ success: false, message: 'Internal Server Error.' });
            } else {
                res.status(200).send({ success: true, message: 'User logged out successfully.' });
            }
        });
    } catch (err) {
        next(err);
    }
}

exports.sendResetPasswordEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).send({ success: false, message: 'Missing credentials.' });
            return;
        }
        const user = await user_util.getUserByEmail(email);
        if (!user) {
            res.status(404).send({ success: false, message: 'User not found.' });
            return;
        }
        res.status(200).send({ success: true, message: 'Reset password email will be sent soon.' });
        const token = await user_util.generateResetPasswordToken(user);
        const url = `${FRONTEND_URL}${token}`;
        console.log(url);
        const reset_password_email = require('../mail_templates/reset_password.js')(url)
        const attachments = [{
            filename: 'vector.jpg',
            path: path.join(__dirname, '..', '..', 'public', 'static', 'vector.jpg'),
            cid: 'vector'
        }];
        await sendEmail(email, 'Reset Password', '', reset_password_email, attachments);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        if (!password || !token) {
            res.status(400).send({ success: false, message: 'Missing credentials.' });
            return;
        }
        const user = await user_util.getUserByResetPasswordToken(token);
        if (!user) {
            res.status(404).send({ success: false, message: 'Invalid token' });
            return;
        }
        await user_util.updatePassword(user.User_Id, password);
        // look for all user sessions and destroy them
        res.status(200).send({ success: true, message: 'Password updated successfully.' });
        const sessions = await user_util.getUserSessions(user.User_Id);
        // console.log(sessions[0])
        if (sessions) {
            sessions.forEach(session => {
                req.sessionStore.destroy(session.sid, (err) => {
                    if (err) {
                        console.error("session err", err);
                    }
                });
            });
        }
    } catch (error) {
        next(error);
    }
}
