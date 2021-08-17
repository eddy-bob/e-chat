const secure = require("../middlewares/secure.js");
const express = require("express");
const { createGroup } = require("../controllers/chatController.js");
const chatRoute = express.Router();
chatRoute.use(secure);
chatRoute.post("/createGroup", createGroup);
module.exports = chatRoute;
