const express = require("express");
const {
  signUpController,
  verifyController,
  loginController,
  getAllUsersController,
  forgotPasswordController,
  resetPasswordController,
  changePasswordController,
} = require("../controller/auth.controller");
const validateUser = require("../validators/auth.validate");
const {
  loginLimiter,
  forgotPasswordLimiter,
} = require("../middleware/express-limit/express-limit");
const isAuthenticated = require("../middleware/authentication/isAuthenticated");

const router = express.Router();

router.route("/").post(validateUser, loginLimiter, signUpController);
router.route("/verify").get(verifyController);
router.route("/login").post(loginLimiter, loginController);
router.route("/change-password").put(isAuthenticated, changePasswordController);
router
  .route("/forgot-password")
  .post(forgotPasswordLimiter, forgotPasswordController);
router.route("/reset-password").put(resetPasswordController);
router.route("/").get(isAuthenticated, loginLimiter, getAllUsersController);

module.exports = router;
