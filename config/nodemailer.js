const nodemailer = require("nodemailer");
const customError = require("../helpers/customErrorResponse.js");
const sendMail = async (reciever, message, subject, next) => {
  const transporter = await nodemailer.createTransport({
    port: 465,
    secure: true,
    host: process.env.NODE_MAILER_HOST,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // send mail with defined transport object
  await transporter.sendMail(
    {
      from: process.env.NODE_MAILER_SENDER,
      to: reciever,
      subject: subject,
      message: message,
    },

    (err, result) => {
      if (err) {
        next(new customError(400, "unable to send mail"));
        console.log("this is the error gotten from nodeMailer" + err);
      } else {
        return result;
      }
    }
  );
};
module.exports = sendMail;
