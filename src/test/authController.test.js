const { expect } = require('chai');
const sinon = require('sinon');
const authController = require('../controllers/authController');
const user_util = require('../utils/user_util');

const mail_util = require('../utils/mail_util');

describe('Auth Controller', () => {
    describe('login', () => {
        it('should return 400 if credentials are missing', async () => {
            const req = { body: {} };
            const res = {};
            const next = sinon.spy();
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns(res);
            await authController.login(req, res, next);
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return 404 if user is not found', async () => {
            const req = { body: { UserName: 'test', Password: 'test' } };
            const res = {};
            const next = sinon.spy();
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns(res);
            sinon.stub(user_util, 'getUser').returns(null);
            await authController.login(req, res, next);
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            user_util.getUser.restore();
        });

        it('should return 401 if credentials are invalid', async () => {
            const req = { body: { UserName: 'test', Password: 'test' } };
            const res = {};
            const next = sinon.spy();
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns(res);
            sinon.stub(user_util, 'getUser').returns({ Password: 'test' });
            sinon.stub(user_util, 'comparePassword').returns(false);
            await authController.login(req, res, next);
            expect(res.status.calledWith(401)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            user_util.getUser.restore();
            user_util.comparePassword.restore();
        });

        it('should return 200 if credentials are valid', async () => {
            const req = { body: { UserName: 'test', Password: 'test' }, session: {} };
            const res = {};
            const next = sinon.spy();
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns(res);
            sinon.stub(user_util, 'getUser').returns({ Password: 'test', Role: { Role_Name: 'test' }, User_Id: 1, UserName: 'test' });
            sinon.stub(user_util, 'comparePassword').returns(true);
            await authController.login(req, res, next);
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(req.session.RoleName).to.equal('test');
            expect(req.session.IsLoggedIn).to.be.true;
            expect(req.session.User_Id).to.equal(1);
            expect(req.session.UserName).to.equal('test');
            user_util.getUser.restore();
            user_util.comparePassword.restore();
        });
    });

    describe('isLoggedIn', () => {
        it('should return 200 if user is logged in', () => {
            const req = { body: { session: { RoleName: 'test' } } };
            const res = {};
            const next = sinon.spy();
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns(res);
            authController.isLoggedIn(req, res, next);
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(res.send.calledWith({ success: true, message: 'User is logged in.', actor: 'test' })).to.be.true;
        });
    });

    describe('logout', () => {
        it('should destroy session and return 200', async () => {
            const req = { session: { destroy: sinon.spy() }, body: { sessionId: 'test' }, sessionStore: { destroy: sinon.stub().callsArg(1) } };
            const res = {};
            const next = sinon.spy();
            res.clearCookie = sinon.stub().returns(res);
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns(res);
            await authController.logout(req, res, next);
            expect(req.session.destroy.calledOnce).to.be.true;
            expect(res.clearCookie.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(req.sessionStore.destroy.calledOnce).to.be.true;
        });
    });

    describe('sendResetPasswordEmail', () => {
        it('should return 400 if email is missing', async () => {
            const req = { body: {} };
            const res = {};
            const next = sinon.spy();
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns(res);
            await authController.sendResetPasswordEmail(req, res, next);
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return 404 if user is not found', async () => {
            const req = { body: { email: 'test@test.com' } };
            const res = {};
            const next = sinon.spy();
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns(res);
            sinon.stub(user_util, 'getUserByEmail').returns(null);
            await authController.sendResetPasswordEmail(req, res, next);
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            user_util.getUserByEmail.restore();
        });
    });

    describe('changePassword', () => {
        it('should return 400 if credentials are missing', async () => {
            const req = { params: {}, body: {} };
            const res = {};
            const next = sinon.spy();
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns(res);
            await authController.changePassword(req, res, next);
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });

        it('should return 404 if user is not found', async () => {
            const req = { params: { token: 'test' }, body: { password: 'test' } };
            const res = {};
            const next = sinon.spy();
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns(res);
            sinon.stub(user_util, 'getUserByResetPasswordToken').returns(null);
            await authController.changePassword(req, res, next);
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            user_util.getUserByResetPasswordToken.restore();
        });

        it('should update password and destroy sessions', async () => {
            const req = { params: { token: 'test' }, body: { password: 'test' }, sessionStore: { destroy: sinon.stub().callsArg(1) } };
            const res = {};
            const next = sinon.spy();
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns(res);
            sinon.stub(user_util, 'getUserByResetPasswordToken').returns({ User_Id: 1 });
            sinon.stub(user_util, 'getUserSessions').returns([{ sid: 'test' }]);
            sinon.stub(user_util, 'updatePassword');
            await authController.changePassword(req, res, next);
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(user_util.updatePassword.calledOnce).to.be.true;
            expect(req.sessionStore.destroy.calledOnce).to.be.true;
            user_util.getUserByResetPasswordToken.restore();
            user_util.getUserSessions.restore();
            user_util.updatePassword.restore();
        });
    });
});
