const { hashPassword, comparePassword } = require("../lib/bcrypt/bcrypt");
const {
  signupmail,
  forgotpasswordmail,
  resetpasswordmail,
} = require("../lib/mail/Mail");
const { createjwtToken, verifyjwtToken } = require("../lib/token/jwt");
const {
  createUser,
  verifyUser,
  loginUserService,
  getAllUserService,
  createAdminService,
  forgotPasswordService,
  saveOtpService,
  resetPasswordService,
  changePasswordService,
} = require("../services/auth/auth.service");
const generateOTP = require("../utils/generateOTP");

exports.signUpController = async (req, res, next) => {
  let data = req.body;
  const hashedPassword = await hashPassword(data.password);
  data = {
    ...data,
    password: hashedPassword,
  };
  try {
    const user = await createUser(data);
    const verificationToken = await createjwtToken(user.id, "1h");
    if (!verificationToken) {
      const error = "Error generating token";
      error.status = 403;
      return next(error);
    }
    try {
      await signupmail({
        receiver: user.email,
        username: user.fullName,
        verificationToken: verificationToken,
      });
    } catch (mailError) {
      next(mailError);
    }
    res.status(200).json({
      success: true,
      data: user,
      message: `Verification mail sent to ${user.email}`,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyController = async (req, res, next) => {
  const token = req.query.token;

  if (!token) {
    const error = new Error("Token is missing");
    error.status = 400;
    return next(error);
  }
  try {
    const verifyToken = await verifyjwtToken(token);
    if (!verifyToken) {
      const error = new Error("Invalid Token");
      error.status = 400;
      return next(error);
    }
    const result = await verifyUser({ id: verifyToken.id });
    res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const error = new Error("Token has expired");
      error.status = 400;
      return next(error);
    }
    if (
      error.message === "invalid signature" ||
      error.message === "jwt malformed"
    ) {
      const error = new Error("Invalid Token");
      error.status = 403;
      return next(error);
    }

    next(error);
  }
};

exports.loginController = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await loginUserService(email);

    !user
      ? next({ status: 400, message: "Invalid Credentials" })
      : !user.isVerified
      ? next({ status: 400, message: "Please verify your account" })
      : null;

    const validPassword = await comparePassword({
      password: password,
      hashedPassword: user.password,
    });

    !validPassword
      ? next({ status: 400, message: "Invalid Credentials" })
      : null;

    const token = await createjwtToken(user.id, "1d");

    res.cookie("token", token).status(200).json({
      success: true,
      message: "Login Successfull",
      token: token,
    });
  } catch (error) {
    next(500, error.message);
  }
};

exports.forgotPasswordController = async (req, res, next) => {
  try {
    const result = await forgotPasswordService(req.body.email);
    const OTP = generateOTP();
    await saveOtpService({ userId: result.id, otp: OTP });
    try {
      await forgotpasswordmail({
        receiver: result.email,
        username: result.fullName,
        OTP: OTP,
      });
    } catch (mailError) {
      next(mailError);
    }

    res.status(200).json({
      success: true,
      message: `OTP sent to ${result.email}`,
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPasswordController = async (req, res, next) => {
  const password = req.body.password;
  const otp = req.query.otp;
  try {
    const hashedPassword = await hashPassword(password);
    const result = await resetPasswordService({
      otp: otp,
      password: hashedPassword,
    });
    try {
      await resetpasswordmail({
        receiver: result.email,
        username: result.fullName,
      });
    } catch (mailError) {
      next(mailError);
    }
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.changePasswordController = async (req, res, next) => {
  const id = req._id;
  const password = req.body.password;
  const hashedPassword = await hashPassword(password);
  try {
    await changePasswordService({
      password: hashedPassword,
      id: id,
    });
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsersController = async (req, res, next) => {
  try {
    const users = await getAllUserService();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    next(500, error.message);
  }
};

exports.createAdminController = async (req, res, next) => {
  let data = req.body;
  const hashedPassword = hashPassword(data.password);
  data = {
    ...data,
    password: hashedPassword,
    role: "admin",
    isVerified: true,
  };
  try {
    const result = await createAdminService(data);
    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserController = async (req, res, next) => {
  const id = req._id;
  const data = req.body;
  ["email", "password", "isVerified", "role"].forEach(
    (field) => delete data[field]
  );
  try {
    if (Object.keys(data).length === 0) {
      const error = "No valid fields to update";
      error.status = 400;
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};
