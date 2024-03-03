const { DataTypes, Model } = require('sequelize');
const db = require('../config/db_config');
const Users = require('./User');
const Experience_Skills = require('./Experience_Skills');

class Experience extends Model {}

Experience.init(
  {
    Experience_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    Job_Title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Company_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Start_Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    End_Date: {
      type: DataTypes.DATE,
    },
    Job_Description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    User_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Salary: {
      type: DataTypes.FLOAT,
    },
    Job_Domain: {
      type: DataTypes.STRING,
    },
    Referral: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    modelName: 'Experience',
    tableName: 'Experience',
    timestamps: true,
  },
);

// Define the association between Users and Experience
Experience.belongsTo(Users, { foreignKey: 'User_Id', onDelete: 'CASCADE' });
Users.hasMany(Experience, { foreignKey: 'User_Id', onDelete: 'CASCADE' });

// Define the association between Experience and Experience_Skills
Experience.hasMany(Experience_Skills, {
  foreignKey: 'Experience_Id',
  onDelete: 'CASCADE',
});
Experience_Skills.belongsTo(Experience, {
  foreignKey: 'Experience_Id',
  onDelete: 'CASCADE',
});

module.exports = Experience;
