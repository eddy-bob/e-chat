const secure = require("../middlewares/secure.js");
const express = require("express");

const authRoute = express.Router();
authRoute.use(secure);
module.exports = authRoute;
