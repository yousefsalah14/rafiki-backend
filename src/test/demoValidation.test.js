const { expect } = require('chai');
const sinon = require('sinon');
const DemoCode = require('../models/DemoCode');
const validateDemoCode = require('../middlewares/demoValidation');

describe('Demo Validation', () => {
	describe('validateDemoCode', () => {
		it('should return an error if demo code is missing', async () => {
			const req = { headers: {} };
			const res = { status: sinon.stub().returnsThis(), send: sinon.stub().returnsThis() };
			const next = sinon.spy();
			await validateDemoCode(req, res, next);
			expect(res.status.calledOnceWith(400)).to.be.true;
			expect(res.send.calledOnceWith({ success: false, message: 'Missing demo code.' })).to.be.true;
			expect(next.notCalled).to.be.true;
		});

		it('should return an error if demo code is invalid', async () => {
			const req = { headers: { 'demo-code': 'invalid-code' } };
			const res = { status: sinon.stub().returnsThis(), send: sinon.stub().returnsThis() };
			const next = sinon.spy();
			sinon.stub(DemoCode, 'findOne').returns(null);
			await validateDemoCode(req, res, next);
			expect(res.status.calledOnceWith(400)).to.be.true;
			expect(res.send.calledOnceWith({ success: false, message: 'Invalid demo code.' })).to.be.true;
			expect(next.notCalled).to.be.true;
			DemoCode.findOne.restore();
		});

		it('should return an error if demo code has expired', async () => {
			const req = { headers: { 'demo-code': 'valid-code' } };
			const res = { status: sinon.stub().returnsThis(), send: sinon.stub().returnsThis() };
			const next = sinon.spy();
			sinon.stub(DemoCode, 'findOne').returns({ expiresAt: new Date('2021-01-01') });
			await validateDemoCode(req, res, next);
			expect(res.status.calledOnceWith(400)).to.be.true;
			expect(res.send.calledOnceWith({ success: false, message: 'Demo code has expired.' })).to.be.true;
			expect(next.notCalled).to.be.true;
			DemoCode.findOne.restore();
		});

		it('should increase numUses and mark demo code as used if code is valid', async () => {
			const req = { headers: { 'demo-code': 'valid-code' } };
			const res = {};
			const next = sinon.spy();
			const demoCode = { numUses: 0, isUsed: false, save: sinon.spy() };
			sinon.stub(DemoCode, 'findOne').returns(demoCode);
			await validateDemoCode(req, res, next);
			expect(demoCode.numUses).to.equal(1);
			expect(demoCode.isUsed).to.be.true;
			expect(demoCode.save.calledOnce).to.be.true;
			expect(req.demoCode).to.equal(demoCode);
			expect(next.calledOnce).to.be.true;
			DemoCode.findOne.restore();
		});
	});
});
