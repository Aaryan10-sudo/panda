const dotenv = require("dotenv");
dotenv.config();

const {
  SMTP_PASSWORD,
  SMTP_EMAIL,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_DIALECT,
  SSL,
  DB_PORT,
  CORS_ORIGIN,
  PANDA_MAIL,
  SECRET_KEY,
} = process.env;

module.exports = {
  SMTP_PASSWORD,
  SMTP_EMAIL,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_DIALECT,
  SSL,
  DB_PORT,
  CORS_ORIGIN,
  PANDA_MAIL,
  SECRET_KEY,
};
