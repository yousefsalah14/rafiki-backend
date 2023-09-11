'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('Users', 'Job_Title', {
			type: Sequelize.STRING,
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn('Users', 'Job_Title');
	},
};
