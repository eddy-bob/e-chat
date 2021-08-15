const errorHandler = (err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ success: false, data: null, Error: err.message });
  next();
};
module.exports = errorHandler;
