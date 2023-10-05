const DemoCode = require('../models/DemoCode');
exports.createDemoCode = async (req, res, next) => {
	try {
		const { code, expiresAt } = req.body;
		if (!code || !expiresAt) {
			res.status(400).send({ success: false, message: 'Missing required fields.' });
			return;
		}
		const demoCode = await DemoCode.create({ code, expiresAt });
		res.status(200).send({ success: true, demoCode });
	} catch (err) {
		if (err.name === 'SequelizeUniqueConstraintError') {
			res.status(400).send({ success: false, message: 'Demo code already exists.' });
			return;
		}
		next(err);
	}
};

exports.getDemoCodes = async (req, res, next) => {
	try {
		const demoCodes = await DemoCode.findAll();
		res.status(200).send({ success: true, demoCodes });
	} catch (err) {
		next(err);
	}
};

exports.getDemoCode = async (req, res, next) => {
	try {
		const { id } = req.params;
		const demoCode = await DemoCode.findByPk(id);
		if (!demoCode) {
			res.status(404).send({ success: false, message: 'Demo code not found.' });
			return;
		}
		res.status(200).send({ success: true, demoCode });
	} catch (err) {
		next(err);
	}
};

exports.updateDemoCode = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { code, expiresAt, valid } = req.body;
		const demoCode = await DemoCode.findByPk(id);
		if (!demoCode) {
			res.status(404).send({ success: false, message: 'Demo code not found.' });
			return;
		}
		if (code) demoCode.code = code;
		if (expiresAt) demoCode.expiresAt = expiresAt;
		if (valid !== undefined) demoCode.valid = valid;
		await demoCode.save();
		res.status(200).send({ success: true, demoCode });
	} catch (err) {
		next(err);
	}
};

exports.deleteDemoCode = async (req, res, next) => {
	try {
		const { id } = req.params;
		const demoCode = await DemoCode.findByPk(id);
		if (!demoCode) {
			res.status(404).send({ success: false, message: 'Demo code not found.' });
			return;
		}
		await demoCode.destroy();
		res.status(200).send({ success: true, message: 'Demo code deleted successfully.' });
	} catch (err) {
		next(err);
	}
};

// update the number of uses of a demo code
exports.updateNumUses = async (req, res, next) => {
	try {
		const { id } = req.params;
		const demoCode = await DemoCode.findByPk(id);
		if (!demoCode) {
			return null;
		}
		demoCode.numUses += 1;
		await demoCode.save();
		return demoCode;
	} catch (err) {
		next(err);
	}
};

exports.verifyDemoCode = async (req, res, next) => {
	res.status(200).send({ success: true, message: 'Demo code is valid.' });
};
