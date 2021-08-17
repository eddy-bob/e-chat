const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const customError = require("../helpers/customErrorResponse.js");
const secure = asyncHandler(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    var userId = req.headers.authorization.split("Bearer ")[1];

    jwt.verify(userId, process.env.JWT_SECRET, (err, result) => {
      if (err) {
        next(new customError(401, "not allow to access this route"));
      } else {
        req.userId = result.id;

        next();
      }
    });
  } else {
    return next(new customError(401, "not allow to access this route"));
  }
});
module.exports = secure;
