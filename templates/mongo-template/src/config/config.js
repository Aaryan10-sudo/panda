const dotenv = require("dotenv");

dotenv.config();

const MONGO_URI =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=${process.env.DB_APP_NAME}` ||
  "mongodb://localhost:27017/panda";

const secretKey = "ThisIsAKey";

module.exports = {
  MONGO_URI,
  secretKey,
};
