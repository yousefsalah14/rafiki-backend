const Skills = require('../models/Skill');
const Users_Skills = require('../models/Users_Skills');
const getSkills = async () => {
    try {
        const skills = await Skills.findAll();
        return skills;
    } catch (err) {
        throw err;
    }
}

const checkSkillNameExists = async (Skill_Name) => {
    try {
        const skill = await Skills.findOne({ where: { Skill_Name } });
        return skill !== null;
    } catch (err) {
        throw err;
    }
}

const addSkill = async ({ Skill_Name, Skill_Description }) => {
    try {
        await Skills.create({ Skill_Name, Skill_Description });
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const getSkillById = async (id) => {
    try {
        const skill = await Skills.findOne({ where: { Skill_Id: id } });
        return skill;
    } catch (err) {
        throw err;
    }
}

const updateSkill = async (id, { Skill_Name, Skill_Description }) => {
    try {
        await Skills.update({ Skill_Name, Skill_Description }, { where: { Skill_Id: id } });
    } catch (err) {
        throw err;
    }
}

const deleteSkill = async (id) => {
    try {
        await Skills.destroy({ where: { Skill_Id: id } });
    } catch (err) {
        throw err;
    }
}

const getUserSkills = async (User_Id) => {
    try {
        const user_skills = await Users_Skills.findAll({ where: { User_Id } });
        return user_skills;
    } catch (err) {
        throw err;
    }
}

const checkUserSkillExists = async (User_Id, Skill_Id) => {
    try {
        const user_skill = await Users_Skills.findOne({ where: { User_Id, Skill_Id } });
        return user_skill !== null;
    } catch (err) {
        throw err;
    }
}

const addUserSkill = async ({ User_Id, Skill_Id, Rate }) => {
    // default rate is 0
    if (!Rate) {
        Rate = 0;
    }
    try {
        await Users_Skills.create({ User_Id, Skill_Id, Rate });
    } catch (err) {
        throw err;
    }
}

const getUserSkillById = async (id) => {
    try {
        const user_skill = await Users_Skills.findOne({ where: { User_Skill_Id: id } });
        return user_skill;
    } catch (err) {
        throw err;
    }
}

const updateUserSkill = async (id, { Rate }) => {
    try {
        await Users_Skills.update({ Rate }, { where: { User_Skill_Id: id } });
    } catch (err) {
        throw err;
    }
}

const deleteUserSkill = async (id) => {
    try {
        await Users_Skills.destroy({ where: { User_Skill_Id: id } });
    } catch (err) {
        throw err;
    }
}




module.exports = {
    getSkills,
    checkSkillNameExists,
    addSkill,
    getSkillById,
    updateSkill,
    deleteSkill,
    getUserSkills,
    checkUserSkillExists,
    addUserSkill,
    getUserSkillById,
    updateUserSkill,
    deleteUserSkill
}
