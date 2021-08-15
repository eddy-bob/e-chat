const response = (res, statusCode, data, msg, jwt) => {
  var secure = null;
  if (process.env.NODE_ENV === "developement") {
    secure = false;
  } else {
    secure = true;
  }

  if (jwt) {
    res
      .status(statusCode)
      .json({ success: true, data: [data], message: msg, accessToken: jwt })
      .cookie("tke", jwt, {
        expires: date.now() + 10 * 60 * 60 * 1000,
        secure: secure,
        httpOnly: true,
      });
  } else {
    return res
      .status(statusCode)
      .json({ success: true, data: [data], message: msg });
  }
};
module.exports = response;
