const speakeasy = require("speakeasy");
const { SECRET_KEY } = require("../config/env");

function generateOTP() {
  const otp = speakeasy.totp({
    secret: SECRET_KEY,
    encoding: "base32",
  });
  return otp;
}

module.exports = generateOTP;
