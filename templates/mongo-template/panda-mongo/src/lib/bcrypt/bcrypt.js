const bcrypt = require("bcryptjs");

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function comparePassword({ password, hashedPassword }) {
  return bcrypt.compare(password, hashedPassword);
}

function hashOTP(otp) {
  return bcrypt.hash(otp, 10);
}

function compareOTP({ otp, hashedOtp }) {
  return bcrypt.compare(otp, hashedOtp);
}

module.exports = {
  hashPassword,
  comparePassword,
  hashOTP,
  compareOTP,
};
