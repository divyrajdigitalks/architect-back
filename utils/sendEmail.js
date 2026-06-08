const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    secure: false, // true for 465, false for other ports like 587
    auth: {
      user: process.env.SMTP_USER || 'dummy',
      pass: process.env.SMTP_PASS || 'dummy',
    },
  });

  // Define the email options
  const mailOptions = {
    from: `${process.env.SMTP_FROM || 'noreply@archisite.com'}`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
