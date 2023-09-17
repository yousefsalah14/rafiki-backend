const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const client = require('https');
/**
 * Generates a PDF file with user data.
 * @param {Object} user - The user data.
 * @param {string} user.name - The user's name.
 * @param {string} user.position - The user's position.
 * @param {string} user.phone - The user's phone number.
 * @param {string} user.email - The user's email address.
 * @param {string} user.about - A brief description of the user's skills and experience.
 * @param {string[]} user.skills - An array of the user's skills.
 * @param {string} user.github - The user's GitHub profile URL.
 * @param {string} user.linkedin - The user's LinkedIn profile URL.
 * @param {string} user.behance - The user's Behance profile URL.
 * @returns {string} The path to the generated PDF file.
 * @throws {Error} If an error occurs while generating the PDF file.
 * @description This function generates a PDF file with the user's data.
 */
module.exports = async function generateCV(user = {}) {
	try {
		const {
			name = '',
			position = '',
			phone = '',
			email = '',
			about = '',
			skills = [],
			github = '',
			linkedin = '',
			behance = '',
			Img = '',
		} = user;

		const firstHalfOfSkills = skills.slice(0, Math.ceil(skills.length / 2));
		const secondHalfOfSkills = skills.slice(Math.ceil(skills.length / 2));
		const skillsLength = Math.max(firstHalfOfSkills.length, secondHalfOfSkills.length);

		// download the user's profile picture
		const profilePicture = fs.createWriteStream(path.join(__dirname, `../../public/static/${name}.jpg`));
		await new Promise((resolve, reject) => {
			const options = {
				timeout: 10000, // set the timeout to 5 seconds
			};
			client.get(Img, options, (response) => {
				response
					.pipe(profilePicture)
					.on('finish', () => {
						profilePicture.close(resolve);
					})
					.on('error', (err) => {
						fs.unlinkSync(path.join(__dirname, `../../public/static/${name}.jpg`));
						console.log(`Error downloading profile picture: ${err}`);
						reject(err);
					});
			});
		});

		const doc = new PDFDocument({
			margin: 30,
			size: 'A4',
			info: {
				Title: `${name} CV`,
				Author: name,
				Subject: 'CV',
				Keywords: 'CV, PDF',
				CreationDate: new Date(),
				Producer: name,
				Creator: name,
			},
		});
		const writeStream = fs.createWriteStream(path.join(__dirname, `../../public/static/${name}-CV.pdf`));

		writeStream.on('error', (err) => {
			console.error(`Error generating PDF file: ${err}`);
		});

		const DM_Sans_Bold = path.join(__dirname, '../../public/static/fonts/DMSans-Bold.ttf');
		const DM_Sans_Regular = path.join(__dirname, '../../public/static/fonts/DMSans-Regular.ttf');
		const DM_Sans_Medium = path.join(__dirname, '../../public/static/fonts/DMSans-Medium.ttf');

		// add the header section with user data
		doc.rect(0, 30, 620, 105).fill('#d9d9d9');
		doc
			.image(`public/static/${name}.jpg`, 20, 45, { width: 75, height: 75, align: 'left' })
			.fillColor('#0097B2')
			.fontSize(24)
			.font(DM_Sans_Bold)
			.text(name.toUpperCase(), 110, 55, { characterSpacing: 2 })
			.fontSize(16)
			.fillColor('#000000')
			.font(DM_Sans_Regular)
			.text(position.toUpperCase(), 110, 85, { characterSpacing: 2.5 })
			.fontSize(10)
			.text(`Phone: ${phone}`, 200, 50, { align: 'right' })
			.text(`Email: ${email}`, 200, 65, { align: 'right' })
			.fontSize(8);
		if (github) {
			doc.fillColor('#333FFF').text(github, 200, 80, {
				align: 'right',
				underline: true,
				link: github,
			});
		}
		if (linkedin) {
			doc.text(linkedin, 200, 95, {
				align: 'right',
				underline: true,
				link: linkedin,
			});
		}
		if (behance) {
			doc.text(behance, 200, 110, {
				align: 'right',
				underline: true,
				link: behance,
			});
		}

		// create the about section with user data
		doc
			.fillColor('#0097B2')
			.fontSize(18)
			.font(DM_Sans_Bold)
			.text('ABOUT', 40, 150, { characterSpacing: 2.5 })
			.font(DM_Sans_Regular)
			.fillColor('#000000')
			.fontSize(12)
			.text(about, 65, 180, { width: 480, align: 'justify', lineBreak: true });
		const aboutHeight = doc.heightOfString(about, { width: 480, align: 'justify', lineBreak: true });
		doc.rect(40, 180, 5, aboutHeight).fillAndStroke('#0097B2');

		// create the skills section with user data
		doc
			.fillColor('#0097B2')
			.fontSize(18)
			.font(DM_Sans_Bold)
			.text('SKILLS', 40, 185 + aboutHeight, { characterSpacing: 2.5 });
		doc
			.fillColor('#000000')
			.fontSize(12)
			.font(DM_Sans_Regular)
			.list(firstHalfOfSkills, 60, 215 + aboutHeight, { bulletRadius: 2, textIndent: 10, lineGap: 5 })
			.list(secondHalfOfSkills, 300, 215 + aboutHeight, { bulletRadius: 2, textIndent: 10, lineGap: 5 });
		const skillsHeight = skillsLength * 20;
		doc.rect(40, 215 + aboutHeight, 5, skillsHeight).fillAndStroke('#0097B2');

		// add the footer section with user data
		doc.fillColor('#a6a8b0').fontSize(18).font('Courier-Bold');
		const endOfPage = doc.page.height - 45;
		doc.fontSize(10).text(`Built by Rafiki`, 50, endOfPage, { characterSpacing: 2.5 });
		const cprHeight = doc.heightOfString(`Built by Rafiki`, { characterSpacing: 2.5 });
		doc.rect(40, endOfPage - 2, 5, cprHeight).fillAndStroke('#e6e6e6');
		doc.end();
		doc.pipe(writeStream);

		await new Promise((resolve, reject) => {
			writeStream.on('finish', () => {
				// remove the user's profile picture
				fs.unlinkSync(path.join(__dirname, `../../public/static/${name}.jpg`));
				// resolve the promise with the generated PDF file path
				resolve(writeStream);
			});
			writeStream.on('error', (err) => {
				// remove the user's profile picture
				fs.unlinkSync(path.join(__dirname, `../../public/static/${name}.jpg`));
				// reject the promise with the error
				reject(err);
			});
		});

		return path.join(__dirname, `../../public/static/${name}-CV.pdf`);
	} catch (error) {
		throw new Error(error);
	}
};
