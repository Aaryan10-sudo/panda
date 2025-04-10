const nodemailer = require("nodemailer");

const transportInfo = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "xthaprabin125@gmail.com",
    pass: "pdhe eqln tdbx cexu",
  },
};

exports.sendEmail = async (mailInfo) => {
  try {
    const transporter = nodemailer.createTransport(transportInfo);
    const info = await transporter.sendMail(mailInfo);
  } catch (error) {
    console.log("error occured", error.message);
  }
};
