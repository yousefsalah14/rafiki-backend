const DemoCode = require('../models/DemoCode');

const demoCodeIpAddresses = new Map();

const getIPv4Address = (ip) => {
	const ipv4Regex = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/;
	const match = ipv4Regex.exec(ip);
	if (match) {
		return match[1];
	}
	return ip;
};

const validateDemoCode = async (req, res, next) => {
	try {
		let code = req.headers['demo-code'];
		const ip = getIPv4Address(req.headers['x-forwarded-for'] || req.ip || null);
		if (!code) {
			return res.status(400).send({ success: false, message: 'Missing demo code.' });
		}
		const demoCode = await DemoCode.findOne({ where: { code } });
		if (!demoCode || demoCode.valid === false) {
			return res.status(400).send({ success: false, message: 'Invalid demo code.' });
		}
		if (demoCode.expiresAt < new Date()) {
			return res.status(400).send({ success: false, message: 'Demo code has expired.' });
		}
		if (demoCodeIpAddresses.has(code)) {
			const ipAddresses = demoCodeIpAddresses.get(code);
			if (ipAddresses.has(!ip)) {
				ipAddresses.add(ip);
			}
		} else {
			demoCodeIpAddresses.set(code, new Set([ip]));
		}
		demoCode.numUses += 1;
		demoCode.isUsed = true;
		await demoCode.save();
		req.demoCode = demoCode;
		next();
	} catch (err) {
		next(err);
	}
};

module.exports = validateDemoCode;
