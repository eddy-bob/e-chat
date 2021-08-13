const response = (statusCode, data, msg, res, count) => {
  if (count) {
    return res
      .status(statusCode)
      .json({ success: true, data: [data], message: msg, count: data.lenth });
  }
  res.status(statusCode).json({ success: true, data: [data], message: msg });
};
module.exports = response;
