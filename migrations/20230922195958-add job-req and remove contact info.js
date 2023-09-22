'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
		await queryInterface.removeColumn('Job_Post', 'Contact_Info');
		await queryInterface.addColumn('Job_Post', 'Job_Requirements', {
			type: Sequelize.TEXT,
		});
		await queryInterface.addColumn('Job_Post', 'Job_Time', {
			type: Sequelize.ENUM('Part-time', 'Full-time'),
			allowNull: false,
			defaultValue: 'Full-time',
		});
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		await queryInterface.dropTable('Job_Skills');
		await queryInterface.dropTable('Job_Application');
		await queryInterface.dropTable('Job_Post');
		await queryInterface.dropTable('Job_Category');
	},
};
