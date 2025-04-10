const { redis } = require("../../config/db/connectRedis");
const Auth = require("../../model/auth.model");
const OTP = require("../../model/otp.model");

async function createUser({ fullName, email, phoneNumber, password, address }) {
  const existUser = await Auth.findOne({ where: { email } });

  if (existUser) {
    throw new Error("User already exists");
  }

  await redis.del("allUsers");

  const result = await Auth.create({
    fullName,
    email,
    phoneNumber,
    password,
    address,
  });
  return result;
}

async function verifyUser({ id }) {
  await Auth.update({ isVerified: true }, { where: { id } });
  await redis.del("allUsers");
  return await Auth.findByPk(id);
}

async function loginUserService(email) {
  const validEmail = await Auth.findOne({ where: { email: email } });
  if (!validEmail) {
    throw new Error("Invalid Credentials");
  }
  return validEmail;
}

async function getAllUserService() {
  const cachedUsers = await redis.get("allUsers");

  if (cachedUsers) {
    return JSON.parse(cachedUsers);
  }
  const result = await Auth.findAll({});

  await redis.set("allUsers", JSON.stringify(result), "EX", 600);

  return result;
}

async function initialAdminService({
  fullName,
  email,
  phoneNumber,
  role,
  password,
  isVerified,
  address,
}) {
  if (!email) {
    return;
  }
  const existUser = await Auth.findOne({ where: { email } });
  if (existUser) {
    return;
  }
  const admin = await Auth.create({
    fullName,
    email,
    phoneNumber,
    password,
    role,
    isVerified,
    address,
  });
  console.log(`Initial admin created with the mail from .env`);
  return admin;
}

async function createAdminService({
  fullName,
  email,
  phoneNumber,
  password,
  role,
  isVerified,
  address,
}) {
  const result = await Auth.create({
    fullName,
    email,
    phoneNumber,
    password,
    role,
    isVerified,
    address,
  });
  return result;
}

async function forgotPasswordService(email) {
  try {
    const user = await Auth.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid Email");
    }
    if (!user.isVerified) {
      throw new Error("Please verify your account first.");
    }
    return user;
  } catch (error) {
    if (
      error.message === "Invalid Email" ||
      error.message === "Please verify your account first."
    ) {
      throw error;
    }
    console.error("Forgot Password Service Error:", error);
    throw new Error("Internal server error");
  }
}

async function saveOtpService({ userId, otp }) {
  const existOTP = await OTP.findOne({ otp: otp });
  if (existOTP) {
    throw new Error("Invalid OTP !");
  }
  return await OTP.create({
    userId,
    otp,
  });
}

async function resetPasswordService({ otp, password }) {
  try {
    const validOTP = await OTP.findOne({ otp });

    if (!validOTP || validOTP.status === "verified") {
      throw new Error("Invalid OTP!");
    }

    if (validOTP.status === "expired") {
      throw new Error("OTP expired");
    }

    await OTP.findByIdAndUpdate(validOTP._id, {
      verified: true,
      status: "verified",
    });

    const user = await Auth.findOne({ where: { id: validOTP.userId } });
    if (!user) {
      throw new Error("User not found");
    }

    await Auth.update({ password: password }, { where: { id: user.id } });

    return user;
  } catch (error) {
    throw new Error(error.message || "Something went wrong!");
  }
}

async function changePasswordService({ id, password }) {
  try {
    if (!id) {
      throw new Error("Please provide ID");
    }
    return await Auth.update({ password }, { where: { id } });
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = resetPasswordService;

module.exports = {
  createUser,
  verifyUser,
  loginUserService,
  getAllUserService,
  initialAdminService,
  createAdminService,
  forgotPasswordService,
  saveOtpService,
  resetPasswordService,
  changePasswordService,
};
