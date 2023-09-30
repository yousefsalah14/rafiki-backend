const job_util = require('../utils/job_util');
const user_util = require('../utils/user_util');
const skills_util = require('../utils/skills_util');
const TelegramBot = require('../services/TelegramBot');
const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID, FRONTEND_URL } = require('../config/config');

// create a job type
exports.addJobCategory = async (req, res, next) => {
	try {
		const { Job_Category_Name } = req.body;
		if (!Job_Category_Name) {
			res.status(400).json({ message: 'No data provided' });
			return;
		}
		//check if job type already exists
		const Job_Category_exists = await job_util.getJobTypeByName(Job_Category_Name);
		if (Job_Category_exists) {
			res.status(409).json({ message: 'Job type already exists', Job_Category: Job_Category_exists });
			return;
		}
		const Job_Category_created = await job_util.addJobType(Job_Category_Name);
		res.status(200).json(Job_Category_created);
	} catch (error) {
		next(error);
	}
};

/**
 * Handles the request to create a new job posting.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing the job details.
 * @param {string} req.body.Job_Title - The title of the job.
 * @param {string} req.body.Description - The description of the job.
 * @param {string} req.body.Company_Name - The name of the company posting the job.
 * @param {string} req.body.Company_Logo - The URL of the company logo.
 * @param {string} req.body.Company_Size - The size of the company.
 * @param {string} req.body.Company_Email - The email address of the company posting the job.
 * @param {string} req.body.External_Link - The external link for the job posting.
 * @param {string} req.body.Location - The location of the job.
 * @param {string} req.body.Application_Deadline - The application deadline for the job.
 * @param {number} req.body.Job_Category_Id - The ID of the job category.
 * @param {string} req.body.Salary - The salary for the job.
 * @param {boolean} req.body.isInternship - Whether the job is an internship or not.
 * @param {string} req.body.Duration - The duration of the job.
 * @param {string} req.body.Job_Type - The type of the job.
 * @param {string} req.body.Education_Level - The education level required for the job.
 * @param {string[]} req.body.Job_Skills - The required skills for the job.
 * @returns {Promise} A promise that resolves to the created job post.
 * @throws {Error} If there was an error adding the job post.
 * @throws {Error} If there was an error adding the job skills.
 * @throws {Error} If there was an error retrieving the job type.
 * @throws {Error} If there was an error retrieving the skill.
 * @throws {Error} If there was an error retrieving the user.
 */
exports.addJobPost = async (req, res, next) => {
	try {
		if (!req.body) {
			res.status(400).json({ message: 'No data provided' });
		}
		const bot = new TelegramBot(TELEGRAM_TOKEN, TELEGRAM_CHAT_ID);
		const {
			Job_Title,
			Description,
			Company_Name,
			Company_Logo,
			Company_Size,
			Company_Email,
			External_Link,
			Location,
			Application_Deadline,
			Job_Category_Id,
			Salary,
			isInternship,
			Duration,
			Job_Type,
			Education_Level,
			Job_Skills,
			Job_Requirements,
			Job_Time,
		} = req.body;
		let { notification } = req.body;
		if (notification === undefined) {
			notification = true;
		}
		const required = {
			Job_Title,
			Description,
			Company_Name,
			Company_Size,
			Location,
			Job_Category_Id,
			isInternship,
			Job_Type,
			Job_Skills,
			Job_Requirements,
		};
		if (!Company_Email && !External_Link) {
			res.status(400).json({ message: 'Missing contact info', missing_fields: ['Company_Email', 'External_Link'] });
			return;
		}
		if (checkMissingFields(required).length > 0) {
			res.status(400).json({ message: 'Job Required fields missing', missing_fields });
			return;
		}
		const Publisher_Id = req.body.session.User_Id;
		if (isInternship === true) {
			const requiredForInternship = { Duration, Education_Level };
			console.log('requiredForInternship', requiredForInternship);
			if (checkMissingFields(requiredForInternship).length > 0) {
				console.log('missing fields', missing_fields);
				res.status(400).json({ message: 'Intern Required fields missing', missing_fields });
				return;
			}
		}
		// check if job category exists
		const Job_Category_exists = await job_util.getJobTypeById(Job_Category_Id);
		if (!Job_Category_exists) {
			res.status(404).json({ message: 'Job type does not exist' });
			return;
		}
		// check for every skill if it exists
		let missing_skills = [];
		for (const id of Job_Skills) {
			const skill_exists = await skills_util.getSkillById(id);
			if (!skill_exists) {
				missing_skills.push(id);
			}
		}
		if (missing_skills.length > 0) {
			res.status(404).json({ message: 'Skill does not exist', missing_skills });
			return;
		}
		const data = {
			Job_Title,
			Description,
			Company_Name,
			Company_Logo,
			Company_Size,
			Company_Email,
			External_Link,
			Location,
			Application_Deadline,
			Job_Category_Id,
			Salary,
			Publisher_Id,
			isInternship,
			Duration,
			Job_Type,
			Education_Level,
			Job_Requirements,
			Job_Time,
		};
		const job_post_created = await job_util.addJobPost(data);
		// array of job skills to be added to the job_skills table
		const job_skills = Job_Skills.map((skill_id) => {
			return { Skill_Id: skill_id, Job_Id: job_post_created.Job_Id };
		});
		const createdSkills = await job_util.addJobSkills(job_skills);
		const formattedDeadline = job_post_created.Application_Deadline?.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
		const message = `
			<strong>There is a new job posted on Rafiki! 🚀</strong>\n<strong>Job Title:</strong> ${
				job_post_created.Job_Title
			} 👀\n<strong>Company:</strong> ${job_post_created.Company_Name} 🏢\n${
			job_post_created.Application_Deadline ? `<strong>Deadline:</strong> ${formattedDeadline} 📅\n` : ''
		}<strong>Location:</strong> ${job_post_created.Location} 📍\nFor more info visit <a href="${
			FRONTEND_URL + 'dashboard/applyJob/' + job_post_created.Job_Id
		}">Rafiki</a>\n
		`;
		if (notification) {
			const messageResult = await bot.sendMessage(message);
			res.status(200).json({ job_post_created, createdSkills, messageSentSuccessfully: messageResult });
			return;
		}
		res.status(200).json({ job_post_created, createdSkills });
	} catch (error) {
		next(error);
	}
};

exports.getAllJobCategories = async (req, res, next) => {
	try {
		const job_types = await job_util.getAllJobCategories();
		res.status(200).json(job_types);
	} catch (error) {
		next(error);
	}
};

exports.getJobPostById = async (req, res, next) => {
	try {
		const { Job_Id } = req.params;
		const job_post = await job_util.getJobPostById(Job_Id);
		if (!job_post) {
			res.status(404).json({ message: 'Job post does not exist' });
			return;
		}
		res.status(200).json(job_post);
	} catch (error) {
		next(error);
	}
};

exports.getJobPosts = async (req, res, next) => {
	try {
		const { page, limit } = req.query;
		const job_posts = await job_util.getJobPosts(Number(page) || 0, Number(limit) || 10);
		res.status(200).json(job_posts);
	} catch (error) {
		next(error);
	}
};

exports.postJobApplication = async (req, res, next) => {
	try {
		const { Job_Id, Cover_Letter, Resume } = req.body;
		const { User_Id } = req.body.session;
		if (!Job_Id) {
			res.status(400).json({ message: 'No data provided' });
			return;
		}
		const job_post = await job_util.getJobPostById(Job_Id);
		if (!job_post) {
			res.status(404).json({ message: 'Job post does not exist' });
			return;
		}
		const user = await user_util.getUserById(User_Id);
		if (!user) {
			res.status(404).json({ message: 'User does not exist' });
			return;
		}
		const data = { Job_Id, Applicant_Id: User_Id, Cover_Letter, Resume };
		const job_application = await job_util.addJobApplication(data);
		res.status(200).json(job_application);
	} catch (error) {
		next(error);
	}
};

exports.getJobApplicationsByUser = async (req, res, next) => {
	try {
		const { User_Id } = req.body.session;
		const job_applications = await job_util.getJobApplicationsByUserId(User_Id);
		res.status(200).json(job_applications);
	} catch (error) {
		next(error);
	}
};

exports.getJobApplicationsByJob = async (req, res, next) => {
	try {
		const { Job_Id } = req.params;
		const job_applications = await job_util.getJobApplicationsByJobId(Job_Id);
		res.status(200).json(job_applications);
	} catch (error) {
		next(error);
	}
};

exports.updateJobApplicationStatus = async (req, res, next) => {
	try {
		const { Job_Application_Id, Status } = req.body;
		const job_application = await job_util.updateJobApplicationStatus(Job_Application_Id, Status);
		res.status(200).json(job_application);
	} catch (error) {
		next(error);
	}
};

exports.deleteJobPost = async (req, res, next) => {
	try {
		const { Job_Id } = req.params;
		const job_post = await job_util.deleteJobPost(Job_Id);
		res.status(200).json(job_post);
	} catch (error) {
		next(error);
	}
};

exports.deleteJobCategory = async (req, res, next) => {
	try {
		const { Job_Category_Id } = req.params;
		const job_category = await job_util.deleteJobCategory(Job_Category_Id);
		res.status(200).json(job_category);
	} catch (error) {
		next(error);
	}
};

function checkMissingFields(required) {
	missing_fields = [];
	for (const [key, value] of Object.entries(required)) {
		if (value === undefined || value === null || value === '') {
			missing_fields.push(key);
		}
	}
	return missing_fields;
}
