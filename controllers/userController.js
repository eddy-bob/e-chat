const asyncHandler = require("express-async-handler");
const customError = require("../helpers/customErrorResponse.js");
const userModel = require("../model/user.js");
const reply = require("../helpers/response.js");
const getAllUsers = asyncHandler(async (req, res, next) => {
  const user = await userModel.find();
  if (user.length >= 1) {
    reply(res, 200, [user], "users fetched");
  } else {
    return reply(res, 200, [], "no user found");
  }
});
const getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findById(id);
  if (!user) {
    next(new customError(404, "user not found"));
  } else {
    return reply(res, 200, [user], "user fetched successfully ");
  }
});
const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findByIdAndDelete(id);
  if (!user) {
    next(new customError(404, "user not found"));
  } else {
    return reply(res, 200, null, "user deleted successfully ");
  }
});
const deleteAllUsers = asyncHandler(async (req, res, next) => {
  const users = await userModel.deleteMany();
  if (!users) {
    reply(res, 404, null, "no users");
  } else {
    return reply(res, 200, users, "users deleted successfully ");
  }
});
const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const options = { new: true, runValidator: true };
  const user = await userModel.findByIdAndUpdate(id, req.body, options);
  if (!user) {
    next(new customError(404, "user not found "));
  } else {
    return reply(res, 201, user, "users updated  successfully ");
  }
});
module.exports = {
  getAllUsers,
  getUser,
  deleteUser,
  deleteAllUsers,
  updateUser,
};
