const asyncHandler = require("express-async-handler");
const { jwt } = require("jsonwebtoken");
const customError = require("../helpers/customErrorResponse.js");
const secure = asyncHandler(async (err, req, res, next) => {
  if (
    req.header.Authorization ||
    req.header.Authorization.startsWith("bearer")
  ) {
    var userId = req.header.Authorization.split("bearer").join(" ");
    id = jwt.verify(userId, process.env.JWT_SECRET, (err) => {
      if (err) next(err);
    });
    req.userId = id;
  } else {
    next(customError(401, "not allow to access this route"));
  }
});
module.exports = secure;
