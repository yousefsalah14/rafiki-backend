const { DataTypes, Model } = require('sequelize');
const db = require('../config/db_config');
const Experience_Skills = require('./Experience_Skills');

class Users_Skills extends Model {}

Users_Skills.init(
  {
    User_Skill_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    User_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    Skill_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    Rate: {
      type: DataTypes.FLOAT,
    },
  },
  {
    sequelize: db,
    modelName: 'Users_Skills',
    tableName: 'Users_Skills',
  },
);

Users_Skills.belongsTo(Experience_Skills, {
  foreignKey: 'User_Skill_Id',
  onDelete: 'CASCADE',
});
Experience_Skills.hasMany(Users_Skills, {
  foreignKey: 'User_Skill_Id',
  onDelete: 'CASCADE',
});

module.exports = Users_Skills;
