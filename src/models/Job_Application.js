const { DataTypes, Model } = require('sequelize');
const db = require('../config/db_config');
const Job_Post = require('./Job_Post');
const User = require('./User');

class Job_Application extends Model {}

Job_Application.init(
	{
		Application_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		Job_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Job_Post,
				key: 'Job_Id',
			},
		},
		Applicant_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: 'User_Id',
			},
		},
		Cover_Letter: {
			type: DataTypes.TEXT,
		},
		Resume: {
			type: DataTypes.STRING,
		},
		Status: {
			type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
			defaultValue: 'Pending',
		},
	},
	{
		sequelize: db,
		modelName: 'Job_Application',
		tableName: 'Job_Application',
		timestamps: true,
		createdAt: 'Application_Date',
		updatedAt: true,
	}
);

Job_Application.belongsTo(Job_Post, { foreignKey: 'Job_Id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Job_Application.belongsTo(User, { foreignKey: 'Applicant_Id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Job_Post.hasMany(Job_Application, { foreignKey: 'Job_Id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User.hasMany(Job_Application, { foreignKey: 'Applicant_Id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = Job_Application;
