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
  getAllUsers,
} = require("../controllers/authController.js");
const authRoute = express.Router();
// prevent unauthrized entry to route

authRoute.post("/login", login);
authRoute.post("/register", register);
authRoute.use(secure).post("/updatePassword", updatePassword);
authRoute.post("/resetPassword:token", resetPassword);
authRoute.post("/forgotPassword", forgotPassword);
authRoute.post("/verifyEmail", verifyEmail);
authRoute.get("/getAllUsers", getAllUsers);
authRoute.use(secure).post("/logout", logout);
authRoute.get("/getAllUsers", getAllUsers);
module.exports = authRoute;
