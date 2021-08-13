const secure = require("../middlewares/secure.js");
const express = require("express");

const chatRoute = express.Router();
chatRoute.use(secure);

module.exports = chatRoute;
