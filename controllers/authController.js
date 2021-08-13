const asyncHandler = require("express-async-handler");
const userModel = require("../model/user.js");
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
});
const login = asyncHandler(async (req, res) => {});
const verifyEmail = asyncHandler(async (req, res) => {});
const updatePassword = asyncHandler(async (req, res) => {});
const forgotPassword = asyncHandler(async (req, res) => {});
const resetPassword = asyncHandler(async (req, res) => {});
module.exports = {
  login,
  register,
  verifyEmail,
  updatePassword,
  forgotPassword,
  resetPassword,
};
