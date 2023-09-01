const skills_util = require('../utils/skills_util');

exports.getSkills = async (req, res, next) => {
    try {
        const skills = await skills_util.getSkills();
        res.status(200).send({ success: true, skills: skills });
    } catch (err) {
        next(err);
    }
}

exports.addSkill = async (req, res, next) => {
    try {
        const { Skill_Name, Skill_Description } = req.body;
        if (!Skill_Name || !Skill_Description) {
            res.status(400).send({ success: false, message: 'Missing required fields.' });
            return;
        }
        const skillExists = await skills_util.checkSkillNameExists(Skill_Name);
        if (skillExists) {
            res.status(409).send({ success: false, message: 'Skill already exists.' });
            return;
        }
        await skills_util.addSkill({ Skill_Name, Skill_Description });
        res.status(201).send({ success: true, message: 'Skill created successfully.' });
    } catch (err) {
        next(err);
    }
}

exports.updateSkill = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { Skill_Name, Skill_Description } = req.body;
        if (!Skill_Name || !id) {
            res.status(400).send({ success: false, message: 'Missing required fields.' });
            return;
        }
        const skill = await skills_util.getSkillById(id);
        if (!skill) {
            res.status(404).send({ success: false, message: 'Skill not found.' });
            return;
        }
        if (Skill_Name !== skill.Skill_Name) {
            const skillExists = await skills_util.checkSkillNameExists(Skill_Name);
            if (skillExists) {
                res.status(409).send({ success: false, message: 'Skill already exists.' });
                return;
            }
        }
        if (!Skill_Description) {
            Skill_Description = skill.Skill_Description;
        }
        if (Skill_Description === skill.Skill_Description && Skill_Name === skill.Skill_Name) {
            res.status(204).send();
            return;
        }
        await skills_util.updateSkill(id, { Skill_Name, Skill_Description });
        res.status(200).send({ success: true, message: 'Skill updated successfully.' });
    } catch (err) {
        next(err);
    }
}

exports.deleteSkill = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).send({ success: false, message: 'Missing required fields.' });
            return;
        }
        const skill = await skills_util.getSkillById(id);
        if (!skill) {
            res.status(404).send({ success: false, message: 'Skill not found.' });
            return;
        }
        await skills_util.deleteSkill(id);
        res.status(200).send({ success: true, message: 'Skill deleted successfully.' });
    } catch (err) {
        next(err);
    }
}
