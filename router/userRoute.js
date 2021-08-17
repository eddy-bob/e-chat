const express = require("express");
const secure = require("../middlewares/secure.js");
const {
  getUser,
  deleteUser,
  getAllUsers,
  updateUser,
  deleteAllUsers,
} = require("../controllers/userController.js");
const userRoute = express.Router();
userRoute.use(secure);
userRoute.get("/getAllUsers", getAllUsers);
userRoute.get("/getUser/:id", getUser);
userRoute.delete("/deleteAllUsers", deleteAllUsers);
userRoute.put(`/updateUser/:id`, updateUser);
userRoute.delete("/deleteUser/:id", deleteUser);
module.exports = userRoute;
