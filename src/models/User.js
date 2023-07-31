const { DataTypes, Model } = require("sequelize");
const db = require("../config/db_config");
const Roles = require("./Role");
const Users_Skills = require("./Users_Skills");
const Skills = require("./Skill");
class Users extends Model { }

Users.init({
    User_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    UserName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    FirstName: {
        type: DataTypes.STRING,
    },
    LastName: {
        type: DataTypes.STRING,
    },
    Phone: {
        type: DataTypes.STRING,
    },
    Role_Id: {
        type: DataTypes.INTEGER,
    },
    National_Id: {
        type: DataTypes.STRING,
    },
    Academic_Id: {
        type: DataTypes.STRING,
    },
    Gender: {
        type: DataTypes.STRING,
    },
    CV: {
        type: DataTypes.STRING,
    },
    Img: {
        type: DataTypes.STRING,
    },
    ImgThumbnail: {
        type: DataTypes.STRING,
    },
    About: {
        type: DataTypes.STRING,
    },
    Color: {
        type: DataTypes.STRING,
    },
    Date_Of_Birth: {
        type: DataTypes.DATE,
    },
    Country: {
        type: DataTypes.STRING,
    },
    GPA: {
        type: DataTypes.FLOAT
    },
    College_Speciality: {
        type: DataTypes.STRING,
    },
    Start_Date_Of_College: {
        type: DataTypes.DATE,
    },
    Graduation_Date_Of_College: {
        type: DataTypes.DATE,
    },
    Grade: {
        type: DataTypes.STRING,
    },
    LinkedIn_URL: {
        type: DataTypes.STRING,
    },
    Behance_URL: {
        type: DataTypes.STRING,
    },
    GitHub_URL: {
        type: DataTypes.STRING,
    },

}, {
    sequelize: db,
    modelName: 'Users',
    tableName: 'Users',
});


Users.belongsTo(Roles, {
    foreignKey: "Role_Id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
Roles.hasMany(Users, {
    foreignKey: "Role_Id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

// Define the association between Users and Skills through Users_Skills
Users.belongsToMany(Skills, {
    through: Users_Skills,
    foreignKey: "User_Id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
Skills.belongsToMany(Users, {
    through: Users_Skills,
    foreignKey: "Skill_Id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});


module.exports = Users;
