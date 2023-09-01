const Sequelize = require('sequelize');
const db = require('../config/db_config');

const Session = db.define('Session', {
    sid: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    User_Id: Sequelize.INTEGER,
    expires: Sequelize.DATE,
    data: Sequelize.TEXT,
});

module.exports = Session;
