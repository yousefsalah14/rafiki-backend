const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Role = require('../models/Role');

/**
 * Login a user.
 * @param {String} UserName - The username of the user to be logged in.
 * @param {String} Password - The password of the user to be logged in.
 * @returns {Promise} A promise that resolves to the logged in user.
 * @throws {Error} If there was an error logging in the user.
 * @throws {Error} If the user was not found.
 * @throws {Error} If the credentials are invalid.
 * @description This function logs in a user.
 * @async
 */
exports.login = async (UserName, Password) => {
	const user = await User.findOne({
		where: {
			UserName,
		},
		include: [
			{
				model: Role,
				attributes: ['Role_Name'],
			},
		],
	});
	if (!user) {
		throw new Error('User not found');
	}
	const isMatch = await bcrypt.compare(Password, user.Password);
	if (!isMatch) {
		throw new Error('Invalid credentials');
	}
	return user;
};
