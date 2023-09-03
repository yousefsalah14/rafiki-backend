const { DataTypes, Model } = require("sequelize");
const db = require("../config/db_config");
const Users_Skills = require("./Users_Skills");
const Users = require("./User");
class Skills extends Model { }

Skills.init({
    Skill_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Skill_Name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'Skills',
    tableName: 'Skills',
});

// Users_Skills.belongsTo(Skills, { foreignKey: 'Skill_Id', onDelete: 'CASCADE' });
// Skills.hasMany(Users_Skills, { foreignKey: 'Skill_Id', onDelete: 'CASCADE' });

module.exports = Skills;

