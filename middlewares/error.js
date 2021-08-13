const errorHandler = (err, req, res, next) => {
  res
    .status(err.statusCode)
    .json({ success: false, data: null, Error: err.message });
};
module.exports = errorHandler;
