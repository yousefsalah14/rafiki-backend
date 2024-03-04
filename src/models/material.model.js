import { DataTypes } from "sequelize";
import Course from "./course.model.js";

import { sequelize } from "../connection.js";
import { User } from "./user.model.js";


const Material = sequelize.define('Material', {
  materialID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  uploadDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  lastModifiedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  uploaderID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fileLocation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileType: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  views: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  downloads: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  visibility: {
    type: DataTypes.ENUM('public', 'private'),
    defaultValue: 'public'
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: true
  },
  adminID: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});
// relations
// many to many 
Material.belongsToMany( Course, { through: 'materialCourse' })
Course.belongsToMany(Material, { through: 'materialCourse' })
//  one to one 
Material.belongsTo(User)
User.hasOne(Material)


export default Material;