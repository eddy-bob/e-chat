const secure = require("../middlewares/secure.js");
const express = require("express");
const {
  login,
  register,
  updatePassword,
  resetPassword,
  forgotPassword,
  verifyEmail,
} = require("../controllers/authController.js");
const authRoute = express.Router();
// prevent unauthrized entry to route
authRoute.use(secure);
authRoute.post("/login", login);
authRoute.post("/register", register);
authRoute.post("/updatePassword", updatePassword);
authRoute.post("/resetPassword", resetPassword);
authRoute.post("/forgotPassword", forgotPassword);
authRoute.post("/verifyEmail", );
module.exports = authRoute;
