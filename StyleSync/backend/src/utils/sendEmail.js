const nodemailer = require("nodemailer");
const EmailConfig = require('../models/EmailConfig')
const sendEmail = async ({ to, subject, text, html }) => {

 const emailInfo = await EmailConfig.findOne({})
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailInfo?.user, //"trendtreasure.fashion@gmail.com"
      pass: emailInfo?.pass //"tdxztkmeljamjqxs",
    },
  });

  const mailOptions = {
    from: emailInfo?.user,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: " + error);
  }
};

module.exports = sendEmail;
