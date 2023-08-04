const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'ams.supp@gmail.com',
        pass: 'ufcvoslivgcudlcv'
    }
});

module.exports = transporter;
