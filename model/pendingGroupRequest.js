const { Schema, model } = require("mongoose");
const pendingGroupRequest = new Schema({
  groupId: {
    type: Schema.ObjectId,
    ref: "group",
    required: [true, "please provide an object id"],
  },
  creator: {
    type: Schema.ObjectId,
    ref: "User",
    required: [true, "please provide an object id"],
  },

  pendingGroupMember: {
    type: String,

    required: [true, "please provide an object id"],
  },
  inviteToken: String,
  createdAt: Date,
});
module.exports = model("pendingGroupRequest", pendingGroupRequest);
