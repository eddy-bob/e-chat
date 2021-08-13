const asyncHandler = require("express-async-handler");

const customError = require("../helpers/customErrorResponse.js");
const secure = asyncHandler(async (err, req, res, next) => {
  if (
    req.header.Authorization ||
    req.header.Authorization.startsWith("bearer")
  ) {
    var userId = req.header.Authorization.split("bearer").join(" ");
    req.userId = userId;
  } else {
    next(customError(401, "not allow to access this route"));
  }
});
module.exports = secure;
