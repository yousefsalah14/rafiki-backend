const { DataTypes, Model } = require('sequelize');
const db = require('../config/db_config');
const Job_Category = require('./Job_Category');
const User = require('./User');
const Skill = require('./Skill');
const Job_Skills = require('./Job_Skills');
class Job_Post extends Model {}

Job_Post.init(
  {
    Job_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    Job_Title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Company_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Company_Logo: {
      type: DataTypes.STRING,
    },
    Company_Size: {
      type: DataTypes.STRING,
    },
    Job_Requirements: {
      type: DataTypes.TEXT,
    },
    Company_Email: {
      type: DataTypes.STRING,
    },
    External_Link: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    Location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Application_Deadline: {
      type: DataTypes.DATE,
    },
    Job_Category_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Job_Category,
        key: 'Job_Category_Id',
      },
    },
    Salary: {
      type: DataTypes.FLOAT,
    },
    Publisher_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isInternship: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    Duration: {
      type: DataTypes.INTEGER,
    },
    Job_Type: {
      type: DataTypes.ENUM('remote', 'onsite', 'hybrid'),
      allowNull: false,
      defaultValue: 'onsite',
    },
    Education_Level: {
      type: DataTypes.ENUM('undergraduate', 'graduate', 'both'),
      allowNull: false,
      defaultValue: 'both',
    },
    Job_Time: {
      type: DataTypes.ENUM('Part-time', 'Full-time'),
      allowNull: false,
      defaultValue: 'Full-time',
    },
  },
  {
    sequelize: db,
    modelName: 'Job_Post',
    tableName: 'Job_Post',
    timestamps: true,
  },
);

Job_Post.belongsTo(Job_Category, {
  foreignKey: 'Job_Category_Id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Job_Category.hasMany(Job_Post, {
  foreignKey: 'Job_Category_Id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Job_Post.belongsTo(User, {
  foreignKey: 'Publisher_Id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
User.hasMany(Job_Post, {
  foreignKey: 'Publisher_Id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Job_Post.belongsToMany(Skill, {
  through: Job_Skills,
  foreignKey: 'Job_Id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'JobSkills',
});
Skill.belongsToMany(Job_Post, {
  through: Job_Skills,
  foreignKey: 'Skill_Id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Job_Post.hasMany(Job_Skills, {
  foreignKey: 'Job_Id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Job_Skills.belongsTo(Job_Post, {
  foreignKey: 'Job_Id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Skill.hasMany(Job_Skills, {
  foreignKey: 'Skill_Id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Job_Skills.belongsTo(Skill, {
  foreignKey: 'Skill_Id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = Job_Post;
