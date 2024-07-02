// https://dev.to/documatic/send-email-in-nodejs-with-nodemailer-using-gmail-account-2gd1

import nodemailer from "nodemailer";

const GOOGLE_PASSWORD = process.env.GOOGLE_PASSWORD;

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "jeremy.voros@carepointhc.com",
    pass: GOOGLE_PASSWORD,
  },
});

/** create reusable sendmail function 
@params {object} options - mail options (to, subject, text, html)
@params {function} callback - callback function to handle response
*/
const sendmail = async (mailDetails, callback) => {
  try {
    const info = await transporter.sendMail(mailDetails);
    callback(info);
  } catch (error) {
    console.log(error);
  }
};

export default sendmail;
