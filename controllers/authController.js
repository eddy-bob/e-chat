const asyncHandler = require("express-async-handler");
const customError = require("../helpers/customErrorResponse");
const reply = require("../helpers/response.js");
const verifyEmailSchema = require("../model/verifyEmail.js");
const userModel = require("../model/user.js");
const sendMail = require("../config/nodemailer.js");
const bcrypt = require("bcrypt");
const register = asyncHandler(async (req, res, next) => {
  var { name, email, password, phone } = req.body;

  //hash password
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);
  password = hashPassword;
  const user = await userModel.create({ name, email, password, phone });
  await user.save();

  const emailVerification = await verifyEmailSchema.create({
    user: user._id,
  });

  const verifyEmailToken = await emailVerification.getToken();
  const url = `${req.protocol}//:${req.get("host")}${
    req.url
  }/${verifyEmailToken}`;
  const freshUser = await userModel.find({ email });
  const subject = "email verification";
  const message = `welcome to e-chat.kindly click on the link below to verify your email.`;

  // send mail

  const err = sendMail(email, message, subject, next, url);

  if (!err) {
    return reply(res, 201, freshUser, "user created successfully");
  } else {
    return reply(
      res,
      201,
      freshUser,
      "user created successfully but mail not sent as a result of network failure"
    );
  }
});
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    await next(new customError(400, "please add an email and password"));
  }
  // check if user exists
  else {
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      next(new customError(404, "user not found"));
    } else {
      // compare password
      console.log(user);
      authenticatedUser = await user.comparePassword(password);

      console.log(authenticatedUser);
      if (!authenticatedUser) {
        return next(new customError(401, "incorrect password"));
      } else {
        user.isLoggedIn = true;
        await user.save();
        const tke = await user.getToken();
        // getfresh user
        const freshUser = await userModel.find({ email });
        reply(res, 200, freshUser, "user logged in successfully", tke);
      }
    }
  }
});
const verifyEmail = asyncHandler(async (req, res, next) => {
  const { userId } = req;

  const emailVerification = await verifyEmailSchema.create({
    user: userId,
  });

  const verifyEmailToken = await emailVerification.getToken();

  const user = await userModel.findById(userId);

  const subject = "email verification";
  const url = `${req.protocol}//:${req.get("host")}${
    req.url
  }/${verifyEmailToken}`;
  console.log(url);
  const message =
    "welcome to e-chat.kindly click on the link below to verify your email";

  const error = await sendMail(user.email, message, subject, next, url);
  if (error) {
    next(new customError(500, "unable to send mail.please try again later"));
  } else {
    return reply(
      res,
      200,
      emailVerification,
      "verification link sent successfully"
    );
  }
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    next(new customError(404, "user not found"));
  }
  const resetToken = await user.genResetPasswordToken();
  console.log("this is the reset password " + resetToken);
  // set token to model
  const userToken = await userModel.findOne({ email }).updateOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: Date.now() + 10 * 3600 * 1000,
  });
  const subject = "forgot password";
  const message = `you requested a reset password.click on the link below to reset password .`;
  const url = `${req.protocol}//:${req.get("host")}${req.url}/${resetToken}`;
  const result = sendMail(email, message, subject, next, url);

  if (!result) {
    next(
      new customError(
        500,
        "unable to send reset password token at this time.please try again later"
      )
    );
  } else {
    return reply(res, 200, undefined, "reset password link sent to email");
  }
});
const updatePassword = asyncHandler(async (req, res, next) => {
  var { newPassword, oldPassword } = req.body;
  if (!newPassword || !oldPassword) {
    return next(
      new customError(400, "please include new password and old password ")
    );
  }
  const { userId } = req;
  const user = await userModel.findById(userId).select("+password");
  const oldIsInDatabase = await user.comparePassword(oldPassword);

  // check if old password is equal to  password in database
  if (!oldIsInDatabase) {
    return next(
      new customError(
        401,
        " old  password must  be the same with previous password "
      )
    );
  }
  // check if you are repeating the same password in database with the new password
  const newIsInDatabase = await user.comparePassword(newPassword);

  if (newIsInDatabase) {
    return next(
      new customError(
        401,
        " new  password must not be the same with previous password "
      )
    );
  }
  // hash password
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(newPassword, saltRounds);

  const options = { new: true, runValidators: true };
  const updateUser = await userModel
    .findByIdAndUpdate(userId, { password: newPassword }, options)
    .select("+password");
  console.log(updateUser);
  reply(res, 200, updateUser, "password updated successfully");
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { resetPasswordToken } = req.params;
  var { newPassword, confirmPassword } = req.body;

  const userToken = await userModel.findOne({ resetPasswordToken });

  console.log(resetPasswordToken);
  if (!userToken) {
    return next(new customError(400, "token does not exist or expired"));
  }

  if (!newPassword || !confirmPassword) {
    return next(
      new customError(400, "please include a password and new password")
    );
  }
  if (newPassword !== confirmPassword) {
    return next(new customError(400, "passwords must match"));
  }
  // hash new password
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(newPassword, saltRounds);
  newPassword = hashPassword;
  // update user
  const newUser = await userModel.findOne({ resetPasswordToken });
  newUser.password = newPassword;
  await newUser.save();

  return reply(res, 201, newUser, "password updated successfully");
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
module.exports = {
  login,
  register,
  verifyEmail,
  updatePassword,
  forgotPassword,
  resetPassword,
  logout,
};
