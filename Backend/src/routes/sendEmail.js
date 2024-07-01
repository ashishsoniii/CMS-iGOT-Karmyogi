const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDERS_EMAIL,
        pass: process.env.SENDERS_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SENDERS_EMAIL,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
};

module.exports = { sendEmail };
