const Auth = require("../model/auth.model");

const createUser = async ({
  fullName,
  email,
  role,
  address,
  phoneNumber,
  password,
  isVerified,
}) => {
  try {
    const result = await Auth.create({
      fullName,
      email,
      role,
      address,
      phoneNumber,
      password,
      isVerified,
    });
    return result;
  } catch (error) {}
};

const readManyUser = async () => {
  try {
    const result = await Auth.find({});
    return result;
  } catch {
    throw new Error(error.message);
  }
};

const readSingleUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await Auth.findById(id);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createUser,
  readManyUser,
  readSingleUser,
};