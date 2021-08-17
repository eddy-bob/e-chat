const nodemailer = require("nodemailer");
const customError = require("../helpers/customErrorResponse.js");
const sendMail = async (reciever, message, subject, next, url) => {
  var error;
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

      html: `<p>${message}</p>
      <a href=${url}>${url}</a> 
      `,
    },

    function (err, result) {
      console.log("this is the result from nodemailer" + result);
      console.log("this is the err from nodemailer" + err);
      error = err;
      if (err) {
        error = err;
      } else {
        console.log(result);
      }
    }
  );
  return error;
};
module.exports = sendMail;
