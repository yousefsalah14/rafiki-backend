const { DataTypes, Model } = require('sequelize');
const db = require('../config/db_config');
// const Experience = require("./Experience");

class Experience_Skills extends Model {}

Experience_Skills.init(
  {
    Experience_Skill_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    Experience_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },

    User_Skill_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize: db,
    modelName: 'Experience_Skills',
    tableName: 'Experience_Skills',
  },
);

// Define the association between Experience and Experience_Skills
// Experience.hasMany(Experience_Skills, {
//     foreignKey: "Experience_Id",
//     onDelete: "CASCADE",
// });
// Experience_Skills.belongsTo(Experience, {
//     foreignKey: "Experience_Id",
//     onDelete: "CASCADE",
// });

module.exports = Experience_Skills;
