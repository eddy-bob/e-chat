const asyncHandler = require("express-async-handler");

const customError = require("../helpers/customErrorResponse");
const reply = require("../helpers/response.js");
const groupModel = require("../model/group.js");
const userModel = require("../model/user.js");
const pendingGroupRequest = require("../model/pendingGroupRequest.js");
const crypto = require("crypto");

const sendMail = require("../config/nodemailer.js");
const pendingRequest = require("../model/pendingRequest");
const createGroup = asyncHandler(async (req, res, next) => {
  const { userId } = req;
  const creator = await userModel.findById(userId);
  const { description, groupName } = req.body;

  // add creator to group member automatically

  const group = await groupModel.create({
    creator,
    description,
    groupName,
    groupMembers: [creator.name],
    admin: [creator.name],
  });

  await group.save();

  console.log("this is the creator" + creator.name);
  // get group
  console.log(group);
  return reply(res, 200, group, "group created successfully");
});
const deleteGroup = asyncHandler(async (req, res, next) => {
  const { groupId } = req.params;
  const { userId } = req;

  const group = await groupModel.findById(groupId);
  if (!group) {
    return next(new customError(404, "group does not exist"));
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
    const deleteGroup = await groupModel.findByIdAndDelete(groupId);
    return reply(res, 200, deleteGroup, "group deleted successfully");
  }
});
const joinGroup = asyncHandler(async (req, res, next) => {
  const { inviteToken } = req.params;
  const group = await pendingGroupRequest.findOne({ inviteToken });
  if (!group) {
    return next(new customError(404, "group does not exist"));
  }
  const pendingMember = await userModel.findById(req.userId);
  const myGroup = await groupModel.findById(group.groupId);
  const isMember = myGroup.groupMembers.includes(pendingMember.name);

  if (isMember) {
    return reply(res, 200, group, "you are already a member of this group");
  }
  const isAllowedToJoin = (group.inviteToken = inviteToken);
  if (isAllowedToJoin) {
    await group.groupMembers.push(pendingMember.name);
    await group.pendingGroupMembers.pop(pendingMember);
    await pendingMember.groupInvite.pop(group.groupName);
    const alreadyResolvedGroup = await pendingGroupRequest
      .findOne(inviteToken)
      .deleteOne();
    await group.save();

    // fetch group with now values added to it
    const modifiedGroup = await groupModel.findById(groupId);

    return reply(res, 201, modifiedGroup, "group joined successfully");
  } else {
    return next(
      new customError(401, "you are not authorized to join this group")
    );
  }
});
const sendGroupInvite = asyncHandler(async (req, res, next) => {
  const { groupId } = req.params;
  const { userEmail } = req.body;
  if (!userEmail) {
    return next(new customError(400, "please include a user email"));
  }
  const group = await groupModel.findById(groupId);
  if (!group) {
    return next(new customError(404, "group not found"));
  }
  const user = await userModel.findOne({ email: userEmail });
  if (!user) {
    return next(new customError(404, "user not found"));
  }
  // send group request
  const token = crypto.randomBytes(20).toString("hex");
  // hash token
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  const pendingRequest = await pendingGroupRequest.create({
    inviteToken: hashToken,
    groupId: group._id,
    creator: req.userId,
    pendingGroupMember: user.name,
  });
  await user.groupInvite.push(group.groupName);

  await group.pendingMembers.push(user.name);
  await user.save();
  await group.save();
  return reply(res, 201, pendingRequest, "group invite sent successfully");
});
const sendFriendRequest = asyncHandler(async (req, res, next) => {
  const { wantedFriend } = req.params;
  const user = await userModel.findById(wantedFriend);

  if (!user) {
    return next(new customError(404, "user not found"));
  }
  const sender = await userModel.findById(req.userId);
  const isMe = sender.name == user.name;

  if (isMe) {
    return next(
      new customError(400, "you cant send a freind request to your self")
    );
  }
  await user.friendRequests.push(sender.name);
  console.log(user);
  // send group request
  const token = crypto.randomBytes(20).toString("hex");
  // hash token
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  const request = await pendingRequest.create({
    pendingFriend: user.name,
    creator: req.userId,
    invite: hashToken,
  });
  const message = `${sender.name} just send you a friend request.visit your open your e-chat to accept or reject request`;
  const err = await sendMail(user.email, message, "friend request");
  if (err) {
    console.log(err);
  }
  await request.save();
  await user.save();
  return reply(res, 201, pendingRequest, "friend request sent successfully");
});
const acceptFriendRequest = asyncHandler(async (req, res, next) => {
  const { inviteToken } = req.params;
  const sender = await userModel.findById(senderId);
  if (!sender) {
    return next(new customError(404, "user not found"));
  }
  const reciever = await userModel.findById(req.userId);
  const sentRequest = await pendingRequest.findOne({ inviteToken });

  if (sentRequest) {
    reciever.friendRequests.pop(sender.name);
    reciever.friends.push(sender.name);
    await sentRequest.deleteOne();
    await sentRequest.save();
    await reciever.save();
    return reply(
      res,
      200,
      reciever,
      ` friend request from ${sender.name} accepted successfully`
    );
  }
});
const blockFriend = asyncHandler(async (req, res, next) => {
  const { blockFriendId } = req.params;
  const friendToBlock = await userModel.findById(blockFriendId);

  if (!friendToBlock) {
    return next(new customError(404, "friend to block not found"));
  }
  const user = await userModel.findById(req.userId);
  await user.friends.pop(friendToBlock.name);
  await user.blockedFriends.push(friendToBlock.name);
  return await reply(
    res,
    200,
    friendToBlock,
    `${friendToBlock.name} blocked successfully`
  );
});
const getAllFriendRequests = asyncHandler(async (req, res, next) => {
  const requests = await pendingRequest.find({ pendingfriend: req.userId });
  if (!requests) {
    return reply(res, 200, [], `you presently do not have any group invite`);
  }
  reply(res, 200, [requests], `friend requests fetched successfully`);
});
const getAllGroupRequests = asyncHandler(async (req, res, next) => {
  const requests = await pendingGroupRequest.find({
    pendingGroupMember: req.userId,
  });
  if (!requests) {
    return reply(res, 200, [], `you presently do not have any friend request`);
  }
  reply(res, 200, [requests], `friend requests fetched successfully`);
});
const chatFriend = asyncHandler(async (req, res) => {});

const voiceCallFriend = asyncHandler(async (req, res) => {});

module.exports = {
  createGroup,
  deleteGroup,
  sendFriendRequest,
  getAllFriendRequests,
  getAllGroupRequests,
  joinGroup,
  chatFriend,
  sendGroupInvite,
  blockFriend,
  voiceCallFriend,
  acceptFriendRequest,
};
