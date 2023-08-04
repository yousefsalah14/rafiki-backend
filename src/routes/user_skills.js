const router = require('express').Router();
const { isAuthorized } = require('../util/Auth');
const skill_util = require('../util/skills_util');
// get all user skills
router.get('/', isAuthorized, async (req, res, next) => {
    try {
        const { User_Id } = req.session;
        const user_skills = await skill_util.getUserSkills(User_Id);
        res.status(200).send({ success: true, user_skills: user_skills ? user_skills : [] });
    } catch (err) {
        next(err);
    }
});

// add user skill
router.post('/', isAuthorized, async (req, res, next) => {
    try {
        const { User_Id } = req.session;
        let { Skill_Id, Rate } = req.body;
        if (!Skill_Id) {
            res.status(400).send({ success: false, message: 'Missing required fields.' });
            return;
        }
        const user_skillExists = await skill_util.checkUserSkillExists(User_Id, Skill_Id);
        if (user_skillExists) {
            res.status(409).send({ success: false, message: 'User skill already exists.' });
            return;
        }
        // check if skill exists
        const skill = await skill_util.getSkillById(Skill_Id);
        if (!skill) {
            res.status(404).send({ success: false, message: 'Skill not found.' });
            return;
        }
        await skill_util.addUserSkill({ User_Id, Skill_Id, Rate });
        res.status(201).send({ success: true, message: 'User skill created successfully.' });
    } catch (err) {
        next(err);
    }
});

// update the rate only 
router.put('/:id', isAuthorized, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { Rate } = req.body;
        const { User_Id } = req.session;
        if (!Rate || !id) {
            res.status(400).send({ success: false, message: 'Missing required fields.' });
            return;
        }
        const user_skill = await skill_util.getUserSkillById(id);
        if (!user_skill) {
            res.status(404).send({ success: false, message: 'User skill not found.' });
            return;
        }
        if (user_skill.User_Id !== User_Id) {
            res.status(403).send({ success: false, message: 'You are not authorized to update this user skill.' });
            return;
        }
        if (parseInt(Rate) === user_skill.Rate) {
            res.status(204).send();
            return;
        }
        await skill_util.updateUserSkill(id, { Rate });
        res.status(200).send({ success: true, message: 'User skill updated successfully.' });
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', isAuthorized, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { User_Id } = req.session;
        if (!id) {
            res.status(400).send({ success: false, message: 'Missing required fields.' });
            return;
        }
        const user_skill = await skill_util.getUserSkillById(id);
        if (!user_skill) {
            res.status(404).send({ success: false, message: 'User skill not found.' });
            return;
        }
        if (user_skill.User_Id !== User_Id) {
            res.status(403).send({ success: false, message: 'You are not authorized to delete this user skill.' });
            return;
        }
        await skill_util.deleteUserSkill(id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});


module.exports = router;
