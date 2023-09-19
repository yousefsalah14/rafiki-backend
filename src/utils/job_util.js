const Job_Post = require('../models/Job_Post');
const Job_Category = require('../models/Job_Category');
const Job_Skills = require('../models/Job_Skills');
const Job_Application = require('../models/Job_Application');
const User = require('../models/User');
const Skill = require('../models/Skill');

/**
 * Add an array of job skills to the database.
 * @param {Array} job_skills - An array of skill IDs and job_id to be added to the job_skills table.
 * @returns {Promise} A promise that resolves to the created job skills.
 * @throws {Error} If there was an error adding the job skills.
 */
exports.addJobSkills = async (job_skills) => {
	try {
		return await Job_Skills.bulkCreate(job_skills);
	} catch (error) {
		console.error('Error adding job skill:', error);
		throw error;
	}
};

/**
 * Add a job post to the database.
 * @param {Object} job_post - An object containing the details of the job post to be added.
 * @returns {Promise} A promise that resolves to the created job post.
 * @throws {Error} If there was an error adding the job post.
 */
exports.addJobPost = async (job_post) => {
	try {
		return await Job_Post.create(job_post);
	} catch (error) {
		console.error('Error adding job post:', error);
		throw error;
	}
};

/**
 * Add a job type to the database.
 * @param {String} Job_Category_Name - The name of the job type to be added.
 * @returns {Promise} A promise that resolves to the created job type.
 * @throws {Error} If there was an error adding the job type.
 */
exports.addJobType = async (Job_Category_Name) => {
	try {
		return await Job_Category.create({ Job_Category_Name });
	} catch (error) {
		console.error('Error adding job type:', error);
		throw error;
	}
};

/**
 * Get job type by name.
 * @param {String} Job_Category_name - The name of the job type to be retrieved.
 * @returns {Promise} A promise that resolves to the retrieved job type.
 * @throws {Error} If there was an error retrieving the job type.
 */
exports.getJobTypeByName = async (Job_Category_name) => {
	try {
		return await Job_Category.findOne({ where: { Job_Category_Name: Job_Category_name } });
	} catch (error) {
		console.error('Error getting job type by name:', error);
		throw error;
	}
};

/**
 * Get job type by id.
 * @param {Number} Job_Category_Id - The id of the job type to be retrieved.
 * @returns {Promise} A promise that resolves to the retrieved job type.
 * @throws {Error} If there was an error retrieving the job type.
 */
exports.getJobTypeById = async (Job_Category_Id) => {
	try {
		return await Job_Category.findOne({ where: { Job_Category_Id } });
	} catch (error) {
		console.error('Error getting job type by id:', error);
		throw error;
	}
};

/**
 * Get All job types.
 * @returns {Promise} A promise that resolves to the retrieved job types.
 * @throws {Error} If there was an error retrieving the job types.
 */
exports.getAllJobCategories = async () => {
	try {
		return await Job_Category.findAll();
	} catch (error) {
		console.error('Error getting all job types:', error);
		throw error;
	}
};

/**
 * Get job post by id.
 * @param {Number} Job_Post_Id - The id of the job post to be retrieved.
 * @returns {Promise} A promise that resolves to the retrieved job post.
 * @throws {Error} If there was an error retrieving the job post.
 * @throws {Error} If there was an error retrieving the job skills.
 * @throws {Error} If there was an error retrieving the job type.
 */
exports.getJobPostById = async (Job_Id) => {
	try {
		const job_post = await Job_Post.findOne({
			where: { Job_Id },
			include: [
				{
					model: Job_Skills,
					attributes: ['Skill_Id'],
					include: [
						{
							model: Skill,
							attributes: ['Skill_Name'],
						},
					],
				},
				{
					model: Job_Category,
					attributes: ['Job_Category_Name'],
				},
			],
		});
		return job_post;
	} catch (error) {
		console.error('Error getting job post by id:', error);
		throw error;
	}
};

// get job posts by pagination
exports.getJobPosts = async (page, limit) => {
	try {
		const job_posts = await Job_Post.findAll({
			offset: page * limit,
			limit,
			include: [
				{
					model: Job_Skills,
					attributes: ['Skill_Id'],
					include: [
						{
							model: Skill,
							attributes: ['Skill_Name'],
						},
					],
				},
				{
					model: Job_Category,
					attributes: ['Job_Category_Name'],
				},
			],
		});
		return job_posts;
	} catch (error) {
		console.error('Error getting job posts:', error);
		throw error;
	}
};

/**
 * Get job posts by job type.
 * @param {Number} Job_Category_Id - The id of the job type to be retrieved.
 * @returns {Promise} A promise that resolves to the retrieved job posts.
 * @throws {Error} If there was an error retrieving the job posts.
 */
exports.getJobPostsByJobType = async (Job_Category_Id) => {
	try {
		return await Job_Post.findAll({
			where: { Job_Category_Id },
			include: [
				{
					model: Job_Skills,
					attributes: ['Skill_Id'],
					include: [
						{
							model: Skill,
							attributes: ['Skill_Name'],
						},
					],
				},
				{
					model: Job_Category,
					attributes: ['Job_Category_Name'],
				},
			],
		});
	} catch (error) {
		console.error('Error getting job posts by job type:', error);
		throw error;
	}
};

/**
 * Add a job application to the database.
 * @param {Object} job_application - An object containing the details of the job application to be added.
 * @param {Number} job_application.Job_Id - The id of the job post to apply to.
 * @param {Number} job_application.Applicant_Id - The id of the user applying to the job.
 * @param {String} job_application.Cover_Letter - The cover letter for the job application.
 * @param {String} job_application.Resume - The resume for the job application.
 * @returns {Promise} A promise that resolves to the created job application.
 * @throws {Error} If there was an error adding the job application.
 */
exports.addJobApplication = async (job_application) => {
	try {
		return await Job_Application.create(job_application);
	} catch (error) {
		console.error('Error adding job application:', error);
		throw error;
	}
};

/**
 * Get job applications by user id.
 * @param {Number} Applicant_Id - The id of the user whose job applications are to be retrieved.
 * @returns {Promise} A promise that resolves to the retrieved job applications.
 * @throws {Error} If there was an error retrieving the job applications.
 */
exports.getJobApplicationsByUserId = async (Applicant_Id) => {
	try {
		return await Job_Application.findAll({
			where: { Applicant_Id },
			include: [
				{
					model: Job_Post,
				},
			],
		});
	} catch (error) {
		console.error('Error getting job applications by user id:', error);
		throw error;
	}
};

/**
 * Get job applications by job id.
 * @param {Number} Job_Id - The id of the job whose job applications are to be retrieved.
 * @returns {Promise} A promise that resolves to the retrieved job applications.
 * @throws {Error} If there was an error retrieving the job applications.
 */
exports.getJobApplicationsByJobId = async (Job_Id) => {
	try {
		const applications = await Job_Application.findAll({
			where: { Job_Id },
			include: [
				{
					model: User,
				},
			],
		});
		// remove the password from the user object
		const job_applications = applications.map((application) => {
			const { User: user, ...rest } = application.dataValues;
			return { ...rest, user: { ...user.dataValues, Password: undefined } };
		});
		return job_applications;
	} catch (error) {
		console.error('Error getting job applications by job id:', error);
		throw error;
	}
};

/**
 * Update the status of a job application.
 * @param {Number} Application_Id - The id of the job application to be updated.
 * @param {String} Status - The new status of the job application.
 * @returns {Promise} A promise that resolves to the updated job application.
 * @throws {Error} If there was an error updating the job application.
 */
exports.updateJobApplicationStatus = async (Application_Id, Status) => {
	try {
		return await Job_Application.update({ Status }, { where: { Application_Id } });
	} catch (error) {
		console.error('Error updating job application status:', error);
		throw error;
	}
};

/**
 * Delete a job post.
 * @param {Number} Job_Id - The id of the job post to be deleted.
 * @returns {Promise} A promise that resolves to the deleted job post.
 * @throws {Error} If there was an error deleting the job post.
 */
exports.deleteJobPost = async (Job_Id) => {
	try {
		return await Job_Post.destroy({ where: { Job_Id } });
	} catch (error) {
		console.error('Error deleting job post:', error);
		throw error;
	}
};
