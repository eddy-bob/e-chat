const express = require("express");

const Route = express.Router();

const authRoute = require("./authRoute.js");
const userRoute = require("./userRoute.js");
const chatRoute = require("./userRoute.js");

Route.use("/auth", authRoute);
Route.use("/user", userRoute);
Route.use("/chat", chatRoute);
module.exports = Route;
