const asyncHandler = require("express-async-handler");
const asyncHandler = require("express-async-handler");
const customError = require("../helpers/customErrorResponse");
const reply = require("../helpers/response.js");
const groupModel = require("../model/group.js");
const userModel = require("../model/user.js");
const createGroup = asyncHandler(async (req, res, next) => {
  const { userId } = req;
  const creator = await userModel.findById(userId);
  const { description, groupName } = req.body;
  if (!description || !groupName) {
    return next(
      new customError(400, "please include description and group name")
    );
  }
  // add creator to group member automatically
  const groupAdmin = await userModel.findById(userId);

  const group = await groupModel.create({ creator, description, groupName });
  await group.save();
  const newGroup = await groupModel.findOne({ groupName });
  // insert creator as group member
  await newGroup.groupMembers.push(groupAdmin.name);
  await newGroup.admin.push(groupAdmin.name);
  // get group
  console.log(newGroup);
  return reply(res, 200, group, "group created successfully");
});
const deleteGroup = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req;

  const group = await groupModel.findById(id);
  if (!group) {
    return next(new customError(404, "group doees not exist"));
  }

  const isOwner = (group.creator = userId);
  if (!isOwner) {
    return next(
      new customError(
        401,
        "you are not allowed to delete this group.only the creator of the group can delete this group or an admin"
      )
    );
  } else {
    const deleteGroup = await groupModel.findByIdAndDelete(id);
    return reply(res, 200, deleteGroup, "group deleted successfully");
  }
});
const joinGroup = asyncHandler(async (req, res) => {
  const {id}=req.params
});

const sendFriendRequest = asyncHandler(async (req, res) => {});
const acceptFriendRequest = asyncHandler(async (req, res) => {});

const chatFriend = asyncHandler(async (req, res) => {});
const blockFriend = asyncHandler(async (req, res) => {});
const voiceCallFriend = asyncHandler(async (req, res) => {});

module.exports = {
  createGroup,
  deleteGroup,
  sendFriendRequest,
  acceptFriendRequest,
  joinGroup,
  chatFriend,

  blockFriend,
  voiceCallFriend,
};
