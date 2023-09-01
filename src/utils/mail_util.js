
const transporter = require('../config/mailer');
/**
 * Send email using nodemailer transporter
 * @param {object} mailDetails - mail options (to, subject, text, html)
 * @returns {Promise} Promise object representing the result of the sendMail operation
 */
const sendMail = (mailDetails) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailDetails, (error, info) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log('Message sent: %s', info.messageId);
                resolve(info);
            }
        });
    });
};



async function sendEmail(email, subject, text, html, attachments) {
    const options = {
        from: 'AMS Support ams.supp@gmail.com',
        to: email,
        subject: subject,
        text: text,
        html: html,
        attachments: attachments
    }
    await sendMail(options).then((info) => {
        console.log("Email sent: " + info.response);
    }).catch((err) => {
        console.log(err);
        throw err;
    });
}



module.exports = {
    sendEmail
}

