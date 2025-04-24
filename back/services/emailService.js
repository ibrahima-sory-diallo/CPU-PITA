const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail({ to, subject, text }) {
  return transporter.sendMail({
    from: `"Mon Site Web" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}

module.exports = { sendMail };
