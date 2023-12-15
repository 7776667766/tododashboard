const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});
module.exports.sendEmail = async ({ email, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Makely Pro" ${process.env.MAIL_FROM_ADDRESS}`,
      to: email,
      subject: subject,
      text: text,
      html: html,
    });
    return true;
  } catch (error) {
    console.log("Error in send email", error);
    return false;
  }
};
