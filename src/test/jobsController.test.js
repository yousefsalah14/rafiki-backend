const { expect } = require('chai');
const sinon = require('sinon');
const jobsController = require('../controllers/jobsController');
const job_util = require('../utils/job_util');
const user_util = require('../utils/user_util');
const skills_util = require('../utils/skills_util');

describe('jobsController', () => {
	describe('addJobPost', () => {
		it('should return a 400 status code if the request body is empty', async () => {
			const req = { body: null };
			const res = {};
			res.status = sinon.stub().returns(res);
			res.json = sinon.stub().returns(res);
			const next = sinon.spy();
			await jobsController.addJobPost(req, res, next);
			expect(res.status.calledWith(400)).to.be.true;
			expect(res.json.calledWith({ message: 'No data provided' })).to.be.true;
		});

		// Add more tests for other scenarios
		it('should return a 400 status code if the request body is missing required fields', async () => {
			const req = {
				body: {
					Job_Title: 'test',
					Description: 'test',
					Company_Name: 'test',
					Company_Size: 'test',
					Contact_Info: 'test',
					Company_Email: 'test',
					Location: 'test',
					Job_Category_Id: 'test',
					isInternship: false,
					Job_Skills: [1],
				},
			};
			const res = {};
			res.status = sinon.stub().returns(res);
			res.json = sinon.stub().returns(res);
			const next = sinon.spy();
			await jobsController.addJobPost(req, res, next);
			expect(res.status.calledWith(400)).to.be.true;
			expect(
				res.json.calledWith({
					message: 'Job Required fields missing',
					missing_fields: ['Job_Type', 'Job_Requirements'],
				})
			).to.be.true;
		});

		it('should return a 400 status code if the request body is missing required fields for internship', async () => {
			const req = {
				body: {
					Job_Title: 'test',
					Description: 'test',
					Company_Name: 'test',
					Company_Size: 'test',
					Contact_Info: 'test',
					Company_Email: 'test',
					Location: 'test',
					Job_Category_Id: 'test',
					isInternship: true,
					Job_Type: 'test',
					Job_Skills: [1],
					Job_Requirements: 'test',
					session: {
						User_Id: 1,
					},
				},
			};
			const res = {};
			res.status = sinon.stub().returns(res);
			res.json = sinon.stub().returns(res);
			const next = sinon.spy();
			await jobsController.addJobPost(req, res, next);
			expect(res.status.calledWith(400)).to.be.true;
			expect(
				res.json.calledWith({
					message: 'Intern Required fields missing',
					missing_fields: ['Duration', 'Education_Level'],
				})
			).to.be.true;
		});

		it('should return a 404 status code if the job type does not exist', async () => {
			const req = {
				body: {
					Job_Title: 'test',
					Description: 'test',
					Company_Name: 'test',
					Company_Size: 'test',
					Contact_Info: 'test',
					Company_Email: 'test',
					Location: 'test',
					Job_Category_Id: 1,
					isInternship: false,
					Job_Type: 'test',
					Job_Requirements: 'test',
					Job_Skills: [1],
					session: {
						User_Id: 1,
					},
				},
			};
			const res = {};
			res.status = sinon.stub().returns(res);
			res.json = sinon.stub().returns(res);
			const next = sinon.spy();
			sinon.stub(job_util, 'getJobTypeById').returns(null);
			await jobsController.addJobPost(req, res, next);
			expect(res.status.calledWith(404)).to.be.true;
			expect(res.json.calledWith({ message: 'Job type does not exist' })).to.be.true;
			job_util.getJobTypeById.restore();
		});

		it('should return a 404 status code if a skill does not exist', async () => {
			const req = {
				body: {
					Job_Title: 'test',
					Description: 'test',
					Company_Name: 'test',
					Company_Size: 'test',
					Contact_Info: 'test',
					Company_Email: 'test',
					Location: 'test',
					Job_Category_Id: 1,
					isInternship: false,
					Job_Type: 'test',
					Job_Requirements: 'test',
					Job_Skills: [1],
					session: {
						User_Id: 1,
					},
				},
			};
			const res = {};
			res.status = sinon.stub().returns(res);
			res.json = sinon.stub().returns(res);
			const next = sinon.spy();
			sinon.stub(job_util, 'getJobTypeById').returns({ Job_Type_Id: 1 });
			sinon.stub(skills_util, 'getSkillById').returns(null);
			await jobsController.addJobPost(req, res, next);
			expect(res.status.calledWith(404)).to.be.true;
			expect(res.json.calledWith({ message: 'Skill does not exist', missing_skills: [1] })).to.be.true;
			job_util.getJobTypeById.restore();
			skills_util.getSkillById.restore();
		});

		it('should return a 200 status code if the job post was added successfully', async () => {
			const req = {
				body: {
					Job_Title: 'test',
					Description: 'test',
					Company_Name: 'test',
					Company_Size: 'test',
					Contact_Info: 'test',
					Company_Email: 'test',
					Location: 'test',
					Job_Category_Id: 1,
					isInternship: false,
					Job_Type: 'test',
					Job_Requirements: 'test',
					Job_Skills: [1],
					Job_Time: 'Full-time',
					session: {
						User_Id: 1,
					},
				},
			};
			const res = {};
			res.status = sinon.stub().returns(res);
			res.json = sinon.stub().returns(res);
			const next = sinon.spy();
			sinon.stub(job_util, 'getJobTypeById').returns({ Job_Type_Id: 1 });
			sinon.stub(skills_util, 'getSkillById').returns({ Skill_Id: 1 });
			sinon.stub(job_util, 'addJobPost').returns({ Job_Id: 1 });
			sinon.stub(job_util, 'addJobSkills').returns({ Skill_Id: 1, Job_Id: 1 });
			await jobsController.addJobPost(req, res, next);
			expect(res.status.calledWith(200)).to.be.true;
			expect(res.json.calledWith({ job_post_created: { Job_Id: 1 }, createdSkills: { Skill_Id: 1, Job_Id: 1 } })).to.be
				.true;
			job_util.getJobTypeById.restore();
			skills_util.getSkillById.restore();
			job_util.addJobPost.restore();
			job_util.addJobSkills.restore();
		});
	});
	describe('getJobPostById', () => {
		it('should return a job post when given a valid ID', async () => {
			const req = { params: { Job_Id: 1 } };
			const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
			const job_post = { id: 1, title: 'Software Engineer' };
			sinon.stub(job_util, 'getJobPostById').resolves(job_post);

			await jobsController.getJobPostById(req, res);

			expect(res.status.calledWith(200)).to.be.true;
			expect(res.json.calledWith(job_post)).to.be.true;
			job_util.getJobPostById.restore();
		});

		it('should return a 404 error when given an invalid ID', async () => {
			const req = { params: { Job_Id: 999 } };
			const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
			sinon.stub(job_util, 'getJobPostById').resolves(null);

			await jobsController.getJobPostById(req, res);

			expect(res.status.calledWith(404)).to.be.true;
			expect(res.json.calledWith({ message: 'Job post does not exist' })).to.be.true;
			job_util.getJobPostById.restore();
		});

		it('should call next with an error when an error occurs', async () => {
			const req = { params: { Job_Id: 1 } };
			const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
			const next = sinon.spy();
			const error = new Error('Internal server error');
			sinon.stub(job_util, 'getJobPostById').rejects(error);

			await jobsController.getJobPostById(req, res, next);

			expect(next.calledWith(error)).to.be.true;
			job_util.getJobPostById.restore();
		});
	});
});
