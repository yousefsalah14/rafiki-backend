const User = require('../models/User');
const Role = require('../models/Role');
const Skill = require('../models/Skill');
const Users_Skills = require('../models/Users_Skills');
const ExperienceSkills = require('../models/Experience_Skills');
const Experience = require('../models/Experience');
const Session = require('../models/Session');
const db = require('../config/db_config');
const sequelize = require('../config/db_config');

const ALUMNI_ROLE_ID = 1;
const ADMIN_ROLE_ID = 2;
const STUDENT_ROLE_ID = 3;
const HR_ROLE_ID = 4;
const PROFESSOR_ROLE_ID = 5;


const syncTables = async (FORCE = false) => {
    await Role.sync({ force: FORCE });
    await User.sync({ force: FORCE });
    await Skill.sync({ force: FORCE });
    await Users_Skills.sync({ force: FORCE });
    await Experience.sync({ force: FORCE });
    await ExperienceSkills.sync({ force: FORCE });
    await Session.sync({ force: FORCE });
}

async function clearTables() {
    try {
        // Step 1: Disable foreign key checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        // Step 2: Clear tables in the desired order (child tables first, then parent tables)
        await sequelize.models.Users_Skills.destroy({ truncate: true });
        await sequelize.models.Experience_Skills.destroy({ truncate: true });
        await sequelize.models.Experience.destroy({ truncate: true });
        await sequelize.models.Skills.destroy({ truncate: true });
        await sequelize.models.Users.destroy({ truncate: true });
        // Add other tables here if needed

        // Step 3: Enable foreign key checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('All tables cleared successfully.');
    } catch (error) {
        console.error('Error clearing tables:', error);
        throw error;
    }
}

module.exports = {
    syncTables,
    ALUMNI_ROLE_ID,
    ADMIN_ROLE_ID,
    STUDENT_ROLE_ID,
    HR_ROLE_ID,
    PROFESSOR_ROLE_ID,
    clearTables
}