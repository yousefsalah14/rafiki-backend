const { DataTypes, Model } = require('sequelize');
const db = require('../config/db_config');

class Job_Skills extends Model {}

Job_Skills.init(
	{
		Job_Skill_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		Job_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		Skill_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize: db,
		modelName: 'Job_Skills',
		tableName: 'Job_Skills',
		timestamps: true,
	}
);

module.exports = Job_Skills;
