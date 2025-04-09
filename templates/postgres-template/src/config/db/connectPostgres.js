const Sequilize = require("sequelize");
const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_DIALECT,
  DB_PORT,
  SSL,
} = require("../config");

const sequelize = new Sequilize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT || "postgres",
  logging: false,
  timezone: "+05:45",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
      ca: SSL,
    },
  },
});

async function connectPostgres() {
  try {
    await sequelize.authenticate();
    console.info("👖 : Connected to Postgres Database...");
    await sequelize.sync().then(() => {
      console.info("🎍 Database Synced Successfully.");
    });
  } catch (error) {
    console.error(`Error connecting postgres...${error.message}`);
  }
}

module.exports = { sequelize, connectPostgres };
