const { DataTypes, Model } = require("sequelize");
const db = require("../config/db_config");


class Experience_Skills extends Model { }

Experience_Skills.init({
    Experience_Skill_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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
}, {
    sequelize: db,
    modelName: 'Experience_Skills',
    tableName: 'Experience_Skills',
});


module.exports = Experience_Skills;

