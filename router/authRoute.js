const secure = require("../middlewares/secure.js");
const express = require("express");
const {
  login,
  register,
  updatePassword,
  resetPassword,
  forgotPassword,
  verifyEmail,
  logout,
} = require("../controllers/authController.js");
const authRoute = express.Router();
// prevent unauthrized entry to route
authRoute.post("/forgotPassword", forgotPassword);
authRoute.post("/login", login);
authRoute.post("/resetPassword/:resetPasswordToken", resetPassword);
authRoute.post("/register", register);
authRoute.use(secure).post("/updatePassword", updatePassword);

authRoute.use(secure).post("/verifyEmail", verifyEmail);

authRoute.use(secure).post("/logout", logout);

module.exports = authRoute;
