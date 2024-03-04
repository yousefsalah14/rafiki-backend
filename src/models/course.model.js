import  { Sequelize, DataTypes } from  "sequelize" ;
import { sequelize } from "../connection.js";

const Course = sequelize.define('Course', {
  courseId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  teamsCode: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  doctorName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  additionalResource: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  lectureTime: {
    type: DataTypes.DATE,
    allowNull: false
  }
});


export default Course;