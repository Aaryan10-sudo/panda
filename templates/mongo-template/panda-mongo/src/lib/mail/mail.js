const pug = require("pug");
const path = require("path");
const sendMail = require("../../utils/sendMail");

async function signupmail({ receiver, username, verificationToken }) {
  const htmlContent = pug.renderFile(
    path.join(__dirname, "./template/signup.jade"),
    {
      name: username,
      verificationToken: verificationToken,
    }
  );
  try {
    await sendMail({
      from: '"Chasing Horizon" <chasinghorizon@gmail.com>',
      to: receiver,
      subject: "Account Registration for Chasing Horizon",
      html: htmlContent,
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function forgotpasswordmail({ username, receiver, OTP }) {
  const htmlContent = pug.renderFile(
    path.join(__dirname, "./template/forgot-password.jade"),
    {
      name: username,
      OTP: OTP,
    }
  );
  try {
    await sendMail({
      from: '"Chasing Horizon" <chasinghorizon@gmail.com>',
      to: receiver,
      subject: "Here’s Your OTP to Reset Your Password",
      html: htmlContent,
    });
  } catch (error) {
    next(error);
  }
}

async function resetpasswordmail({ username, receiver }) {
  const htmlContent = pug.renderFile(
    path.join(__dirname, "./template/password-reset.jade"),
    {
      name: username,
    }
  );
  try {
    await sendMail({
      from: '"Chasing Horizon" <chasinghorizon@gmail.com>',
      to: receiver,
      subject: "Success! Your Password Has Been Reset",
      html: htmlContent,
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { signupmail, forgotpasswordmail, resetpasswordmail };
