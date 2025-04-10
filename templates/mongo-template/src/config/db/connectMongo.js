const { default: mongoose } = require("mongoose");
const { MONGO_URI } = require("../config");

async function connectMongo() {
  try {
    mongoose.connect(MONGO_URI);
    console.log("👖 : Connected to mongoDB");
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = connectMongo;
