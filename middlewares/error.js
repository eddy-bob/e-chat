const errorHandler = (err, req, res, next) => {
  return res
    .status(err.statusCode || 500)
    .json({ success: false, data: null, Error: err.message });
};
module.exports = errorHandler;
