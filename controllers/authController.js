const asyncHandler = require("express-async-handler");
const customError = require("../helpers/customErrorResponse");
const reply = require("../helpers/response.js");
const verifyEmailSchema = require("../model/verifyEmail.js");
const userModel = require("../model/user.js");
const sendMail = require("../config/nodemailer.js");
const bcrypt = require("bcrypt");
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  const user = await userModel.create({ name, email, password, phone });
  await user.save();

  const emailVerification = await verifyEmailSchema.create({
    user: user._id,
  });

  const verifyEmailToken = await emailVerification.getToken();
  const freshUser = await userModel.find({ email });
  const subject = "email verification";
  const message = `welcome to e-chat.kindly click on the link below to verify your email.${process.env.FRONTEND_URL} ${verifyEmailToken}`;
  // send mail
  await sendMail(email, message, subject, next);
  reply(res, 201, freshUser, "user created successfully");
});
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new customError(400, "please add an email and password"));
  }
  // check if user exists
  const user = await userModel.findOne({ email }).select("+password");

  console.log("this is the user" + user);
  if (!user) {
    next(new customError(404, "user not found"));
  }
  // compare password
  authenticatedUser = await user.comparePassword(password);

  console.log(authenticatedUser);
  if (authenticatedUser) {
    next(new customError(401, "incorrect password"));
  } else {
    user.isLoggedIn = true;
    await user.save();
    const tke = await user.getToken();
    // getfresh user
    const freshUser = await userModel.find({ email });
    reply(res, 200, freshUser, "user logged in successfully", tke);
  }
});
const verifyEmail = asyncHandler(async (req, res) => {
  const { userId } = req;

  const emailVerification = await verifyEmailSchema.create({
    user: UserId,
  });
  const verifyEmailToken = emailVerification.getToken();
  const user = await verifyEmailSchema.find({ user: UserId });
  const subject = "email verification";
  const message = `welcome to e-chat.kindly click on the link below to verify your email.${process.env.FRONTEND_URL} ${verifyEmailToken}`;
  sendMail(user.email, message, subject);
  reply(res, 200, user, "verification link sent successfully");
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    next(new customError(404, "user not found"));
  }
  const resetToken = await user.genResetPasswordToken();
  const subject = "forgot password";
  const message = `you requested a reset password.click on the link below to reset password ${process.env.FRONTEND_URL} ${resetToken}`;
  sendMail(user.email, message, subject);
  reply(res, 200, undefined, "reset password link sent to email");
});
const updatePassword = asyncHandler(async (req, res, next) => {
  const { newPassword, oldPassword } = req.body;
  if (!newPassword || !oldPassword) {
    next(new customError(400, "please include new password and old password "));
  }
  const { userId } = req;
  const user = userModel.findById(userId).comparePassword(oldPassword);
  if (!user) {
    next(new customError(401, "incorrect password "));
  }
  const options = { new: true, runValidators: true };
  const updateUser = await userModel.findByIdAndUpdate(
    userId,
    req.body,
    options
  );
  reply(res, 200, updateUser, "password updated successfully");
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { email } = req.body;
  const userToken = await userModel
    .findByEmail(email)
    .select(resetPasswordToken);
  if (!userToken) {
    next(new customError(404, "user not found "));
  }
  if (token === userToken) {
    const options = { new: true, runValidators: true };

    const updatePassword = await userModel.findByEmailAndUpdate(
      email,
      req.body,
      options
    );
    reply(res, 201, updatePassword, "password updated successfully");
  } else {
    next(new customError(401, "token expired /does not exist"));
  }
});
const logout = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.userId,
    { isLoggedIn: false },
    { new: true, runValidators: true }
  );

  if (!user) {
    res.status(200).json({ message: "not found" });
  } else {
    return res.status(200).json({
      success: true,
      message: "logged out successefully",
    });
  }
});
const getAllUsers = asyncHandler(async (req, res, next) => {
  const user = await userModel.find();
  if (user) {
    return reply(res, 200, [user], "user fetched");
  }
  reply(res, 201, [], "no user found");
});
module.exports = {
  login,
  register,
  verifyEmail,
  updatePassword,
  forgotPassword,
  resetPassword,
  logout,
  getAllUsers,
};
