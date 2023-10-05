const { DataTypes, Model } = require('sequelize');
const db = require('../config/db_config');

class DemoCode extends Model {}

DemoCode.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		code: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		expiresAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		numUses: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		valid: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
	{
		timestamps: true,
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
		sequelize: db,
		modelName: 'DemoCode',
		tableName: 'DemoCodes',
	}
);

module.exports = DemoCode;
