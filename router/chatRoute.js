const secure = require("../middlewares/secure.js");
const express = require("express");
const {
  createGroup,
  deleteGroup,
  sendFriendRequest,
  getAllFriendRequests,
  getAllGroupRequests,
  joinGroup,
  acceptFriendRequest,
  chatFriend,
  sendGroupInvite,
  blockFriend,
  voiceCallFriend,
} = require("../controllers/chatController.js");
const chatRoute = express.Router();
chatRoute.use(secure);
chatRoute.post("/createGroup", createGroup);
chatRoute.delete("/deleteGroup/:groupId", deleteGroup);
chatRoute.post("/sendFriendRequest/:wantedFriend", sendFriendRequest);
chatRoute.get("/getAllFriendRequests", getAllFriendRequests);
chatRoute.get("/getAllGroupRequests", getAllGroupRequests);
chatRoute.post("/joinGroup/:inviteToken", joinGroup);
chatRoute.post("/sendGroupInvite/:groupId", sendGroupInvite);
chatRoute.post("/blockFriend/:blockFriendId", blockFriend);
chatRoute.post("/ acceptFriendRequest/:inviteToken", acceptFriendRequest);

module.exports = chatRoute;
