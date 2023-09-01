const { expect } = require('chai');
const sinon = require('sinon');
const { checkAuthorization } = require('../middlewares/Auth');

describe('Auth', () => {
    describe('checkAuthorization', () => {
        it('should call next if user is authorized', () => {
            const req = { headers: { authorization: 'Bearer mockSessionId' }, sessionStore: { get: sinon.stub() }, body: {}, session: {} };
            const res = {};
            const next = sinon.spy();
            const mockSession = { IsLoggedIn: true, RoleName: 'Admin', User_Id: 1, UserName: 'mockUserName' };
            req.sessionStore.get.withArgs('mockSessionId').yields(null, mockSession);
            checkAuthorization(['Admin'])(req, res, next);
            expect(next.calledOnce).to.be.true;
            expect(req.session.User_Id).to.equal(mockSession.User_Id);
            expect(req.session.RoleName).to.equal(mockSession.RoleName);
            expect(req.session.IsLoggedIn).to.equal(mockSession.IsLoggedIn);
            expect(req.session.UserName).to.equal(mockSession.UserName);
            expect(req.body.sessionId).to.equal('mockSessionId');
        });

        it('should return 401 if user is not authorized', () => {
            const req = { headers: { authorization: 'Bearer mockSessionId' }, sessionStore: { get: sinon.stub() }, session: {}, body: {} };
            const res = {};
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns(res);
            const next = sinon.spy();
            const mockSession = { IsLoggedIn: true, RoleName: 'Student', User_Id: 1, UserName: 'mockUserName' };
            req.sessionStore.get.withArgs('mockSessionId').yields(null, mockSession);
            checkAuthorization(['Admin'])(req, res, next);
            expect(res.status.calledWith(401)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(next.notCalled).to.be.true;
        });

        it('should return 500 if session store returns an error', () => {
            const req = { headers: { authorization: 'Bearer mockSessionId' }, sessionStore: { get: sinon.stub() }, session: {}, body: {} };
            const res = {};
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns(res);
            const next = sinon.spy();
            const mockError = new Error('Session store error');
            req.sessionStore.get.withArgs('mockSessionId').yields(mockError);
            checkAuthorization(['Admin'])(req, res, next);
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(next.notCalled).to.be.true;
        });
    });
});