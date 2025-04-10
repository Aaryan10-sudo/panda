const bcrypt = require("bcrypt");

const hashMyPassword = async (normalPassword) => {
  try {
    const hashed = await bcrypt.hash(normalPassword, 10);
    return hashed;
  } catch {
    throw new Error(error.message);
  }
};

module.exports = {
  hashMyPassword,
};
