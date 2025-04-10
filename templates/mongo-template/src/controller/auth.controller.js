const bcrypt = require("bcrypt");
const {
  createUser,
  readManyUser,
  readSingleUser,
} = require("../services/auth.service");
const { generateToken, verifyToken } = require("../lib/token/jwt");
const { hashMyPassword } = require("../lib/bcrypt/bcrypt");
const { sendEmail } = require("../lib/mail/mail");

exports.createUser = async (req, res, next) => {
  try {
    let data = req.body;
    const hashedPassword = await hashMyPassword(data.password);

    data = {
      ...data,
      isVerified: false,
      password: hashedPassword,
    };

    const result = await createUser(data);
    const token = await generateToken(result);

    await sendEmail({
      to: result.email,
      subject: "Please verify your account.",
      html: `<a href="http://localhost:3000/auth/verify?token=${token}">${token}</a>`,
    });

    res.cookie("token", token).status(201).json({
      success: true,
      message: "Verification mail sent",
      data: result,
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      succes: false,
      message: error.message,
    });
  }
};

exports.verifyUserEmail = async (req, res, next) => {
  try {
    const result = await verifyToken(req);

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
