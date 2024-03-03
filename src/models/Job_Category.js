const { DataTypes, Model } = require('sequelize');
const db = require('../config/db_config');

class Job_Category extends Model {}

Job_Category.init(
  {
    Job_Category_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    Job_Category_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'Job_Category',
    tableName: 'Job_Category',
    timestamps: true,
  },
);

module.exports = Job_Category;
