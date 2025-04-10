const { secretKey } = require("../../config/config");
const jwt = require("jsonwebtoken");
const Auth = require("../../model/auth.model");

exports.generateToken = async (user) => {
  try {
    let infoObject = {
      id: user._id,
    };

    const expiryInfo = {
      expiresIn: "1d",
    };

    const token = await jwt.sign(infoObject, secretKey, expiryInfo);
    return token;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.verifyToken = async (req) => {
  try {
    const tokenString = req.headers.authorization;

    const tokenArray = tokenString.split(" ");
    const token = tokenArray[1];

    const infoObject = await jwt.verify(token, secretKey);

    const userId = infoObject.id;

    const result = await Auth.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    );

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
