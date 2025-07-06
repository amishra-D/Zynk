const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = {
  generateOTP,
  transporter,
};
