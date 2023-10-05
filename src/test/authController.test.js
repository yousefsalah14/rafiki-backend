const { expect } = require('chai');
const sinon = require('sinon');
const authController = require('../controllers/authController');
const user_util = require('../utils/user_util');
const auth_util = require('../utils/auth_util');
const mail_util = require('../services/Mail');

describe('Auth Controller', () => {
	describe('register', () => {
		it('should return 400 if body is missing', async () => {
			const req = { body: null };
			const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
			const next = sinon.spy();
			await authController.register(req, res, next);
			expect(res.status.calledWith(400)).to.be.true;
			expect(res.json.calledWith({ success: false, message: 'No data provided' })).to.be.true;
		});

		it('should return 400 if required fields are missing', async () => {
			const req = { body: {} };
			const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
			const next = sinon.spy();
			await authController.register(req, res, next);
			expect(res.status.calledWith(400)).to.be.true;
			expect(res.json.calledWithMatch({ success: false, message: 'Missing credentials.' })).to.be.true;
		});

		it('should return 409 if user already exists', async () => {
			const req = {
				body: {
					UserName: 'existinguser',
					Password: 'password',
					Email: 'existing@user.com',
					Role_Id: 1,
					Academic_Id: '123456789',
					Date_Of_Birth: '1999-01-01',
					FirstName: 'test',
					LastName: 'test',
				},
			};
			const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };
			const next = sinon.spy();
			sinon.stub(user_util, 'checkEmailExists').returns(true);
			sinon.stub(user_util, 'checkUserNameExists').returns(false);
			await authController.register(req, res, next);
			expect(res.status.calledWith(409)).to.be.true;
			expect(res.send.calledWith({ success: false, message: 'User already exists.' })).to.be.true;
			user_util.checkEmailExists.restore();
			user_util.checkUserNameExists.restore();
		});

		it('should return 403 if role is admin or professor', async () => {
			const req = {
				body: {
					UserName: 'existinguser',
					Password: 'password',
					Email: 'existing@user.com',
					Role_Id: 2,
					Date_Of_Birth: '1999-01-01',
					FirstName: 'test',
					LastName: 'test',
				},
			};
			const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
			const next = sinon.spy();
			sinon.stub(user_util, 'checkEmailExists').returns(false);
			sinon.stub(user_util, 'checkUserNameExists').returns(false);
			await authController.register(req, res, next);
			// log args
			console.log(res.status.args);
			console.log(res.json.args);
			expect(res.status.calledWith(403)).to.be.true;
			expect(res.json.calledWith({ success: false, message: 'Forbidden.' })).to.be.true;
			user_util.checkEmailExists.restore();
			user_util.checkUserNameExists.restore();
		});

		it('should return 201 if user is created successfully', async () => {
			const req = {
				body: {
					UserName: 'newuser',
					Password: 'password',
					Email: 'existing@user.com',
					Role_Id: 1,
					Date_Of_Birth: '1999-01-01',
					FirstName: 'test',
					LastName: 'test',
				},
			};
			const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
			const next = sinon.spy();
			sinon.stub(user_util, 'checkEmailExists').returns(false);
			sinon.stub(user_util, 'checkUserNameExists').returns(false);
			sinon.stub(auth_util, 'register').resolves({});
			await authController.register(req, res, next);
			expect(res.status.calledWith(201)).to.be.true;
			expect(res.json.calledWithMatch({ success: true, message: 'User created successfully.' })).to.be.true;
			auth_util.register.restore();
			user_util.checkEmailExists.restore();
			user_util.checkUserNameExists.restore();
		});

		it('should return 500 if an error occurs', async () => {
			const req = {
				body: {
					UserName: 'newuser',
					Password: 'password',
					Email: 'existing@user.com',
					Role_Id: 1,
					Date_Of_Birth: '1999-01-01',
					FirstName: 'test',
					LastName: 'test',
				},
			};
			const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
			const next = sinon.spy();
			sinon.stub(user_util, 'checkEmailExists').returns(false);
			sinon.stub(user_util, 'checkUserNameExists').returns(false);
			sinon.stub(auth_util, 'register').rejects(new Error('test'));
			await authController.register(req, res, next);
			expect(next.calledOnce).to.be.true;
			auth_util.register.restore();
			user_util.checkEmailExists.restore();
			user_util.checkUserNameExists.restore();
		});
	});

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
			const req = { body: { UserName: 'nonexistentuser', Password: 'password' } };
			const res = {};
			const next = sinon.spy();
			res.status = sinon.stub().returns(res);
			res.send = sinon.stub().returns(res);
			sinon.stub(auth_util, 'login').rejects(new Error('User not found'));
			await authController.login(req, res, next);
			expect(res.status.calledWith(404)).to.be.true;
			expect(res.send.calledWith({ success: false, message: 'User not found.' })).to.be.true;
			auth_util.login.restore();
		});

		it('should return 401 if credentials are invalid', async () => {
			const req = { body: { UserName: 'existinguser', Password: 'wrongpassword' } };
			const res = {};
			const next = sinon.spy();
			res.status = sinon.stub().returns(res);
			res.send = sinon.stub().returns(res);
			sinon.stub(auth_util, 'login').rejects(new Error('Invalid credentials'));
			await authController.login(req, res, next);
			auth_util.login.restore();
			expect(res.status.calledWith(401)).to.be.true;
			expect(res.send.calledWith({ success: false, message: 'Invalid credentials.' })).to.be.true;
		});

		it('should return 200 if user is logged in successfully', async () => {
			const req = { body: { UserName: 'existinguser', Password: 'password' }, session: { id: '123' } };
			const res = {};
			const next = sinon.spy();
			res.status = sinon.stub().returns(res);
			res.send = sinon.stub().returns(res);
			const user = { Role: { Role_Name: 'admin' }, User_Id: 1, UserName: 'existinguser' };
			sinon.stub(auth_util, 'login').resolves(user);
			await authController.login(req, res, next);
			expect(res.status.calledWith(200)).to.be.true;
			expect(
				res.send.calledWith({
					success: true,
					actor: 'admin',
					user_id: 1,
					user_name: 'existinguser',
					sessionId: '123',
					message: 'User logged in successfully.',
				})
			).to.be.true;
			auth_util.login.restore();
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
			const req = {
				session: { destroy: sinon.spy() },
				body: { sessionId: 'test' },
				sessionStore: { destroy: sinon.stub().callsArg(1) },
			};
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
			const req = {
				params: { token: 'test' },
				body: { password: 'test' },
				sessionStore: { destroy: sinon.stub().callsArg(1) },
			};
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
