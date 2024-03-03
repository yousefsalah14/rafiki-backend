const User = require('../models/User');
const Role = require('../models/Role');
const Skill = require('../models/Skill');
const Users_Skills = require('../models/Users_Skills');
const ExperienceSkills = require('../models/Experience_Skills');
const Experience = require('../models/Experience');
const Session = require('../models/Session');
const Job_Post = require('../models/Job_Post');
const Job_Category = require('../models/Job_Category');
const Job_Skills = require('../models/Job_Skills');
const Job_Application = require('../models/Job_Application');
const DemoCode = require('../models/DemoCode');
const sequelize = require('../config/db_config');
const ALUMNI_ROLE_ID = 1;
const ADMIN_ROLE_ID = 2;
const STUDENT_ROLE_ID = 3;
const HR_ROLE_ID = 4;
const PROFESSOR_ROLE_ID = 5;

const { rateLimit } = require('express-rate-limit');
// Rate limiting
function createLimiter(window, max) {
  const limiter = rateLimit({
    windowMs: window, // in milliseconds
    max: max,
    standardHeaders: 'draft-7',
    message: 'Too many requests, please try again later.',
    legacyHeaders: true,
    validate: { trustProxy: false },
  });
  return limiter;
}

const syncTables = async (FORCE = false) => {
  await Role.sync({ force: FORCE });
  await User.sync({ force: FORCE });
  await Skill.sync({ force: FORCE });
  await Users_Skills.sync({ force: FORCE });
  await Experience.sync({ force: FORCE });
  await ExperienceSkills.sync({ force: FORCE });
  await Session.sync({ force: FORCE });
  await Job_Category.sync({ force: FORCE });
  await Job_Post.sync({ force: FORCE });
  await Job_Skills.sync({ force: FORCE });
  await Job_Application.sync({ force: FORCE });
  await DemoCode.sync({ force: FORCE });
};

async function clearTables() {
  try {
    // Step 1: Disable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Step 2: Clear tables in the desired order (child tables first, then parent tables)
    await sequelize.models.Job_Application.destroy({ truncate: true });
    await sequelize.models.Job_Post.destroy({ truncate: true });
    await sequelize.models.Job_Category.destroy({ truncate: true });
    await sequelize.models.Session.destroy({ truncate: true });
    await sequelize.models.Users_Skills.destroy({ truncate: true });
    await sequelize.models.Experience_Skills.destroy({ truncate: true });
    await sequelize.models.Experience.destroy({ truncate: true });
    await sequelize.models.Skills.destroy({ truncate: true });
    await sequelize.models.Users.destroy({ truncate: true });
    // await sequelize.models.DemoCode.destroy({ truncate: true }); //! Uncomment this line if you want to clear the DemoCode table
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
  clearTables,
  createLimiter,
};
