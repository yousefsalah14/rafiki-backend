const User = require('../models/User');
const Role = require('../models/Role');
const Skill = require('../models/Skill');
const Users_Skills = require('../models/Users_Skills');
const ExperienceSkills = require('../models/Experience_Skills');
const Experience = require('../models/Experience');


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
}

module.exports = {
    syncTables,
    ALUMNI_ROLE_ID,
    ADMIN_ROLE_ID,
    STUDENT_ROLE_ID,
    HR_ROLE_ID,
    PROFESSOR_ROLE_ID
}