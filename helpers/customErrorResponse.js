const customError = class myError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.statusCode = statusCode;
  }
};
module.exports = customError;
