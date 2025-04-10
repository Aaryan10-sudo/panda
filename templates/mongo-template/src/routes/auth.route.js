const express = require("express");
const {
  createUser,
  verifyUserEmail,
} = require("../controller/auth.controller");
const validateUser = require("../validator/auth.validate");

const authRouter = express.Router();

authRouter.post("/", validateUser, createUser);
authRouter.get("/verify", verifyUserEmail);

module.exports = {
  authRouter,
};
