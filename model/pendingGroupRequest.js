const { Schema } = require("mongoose");
const pendingGroupRequest = new Schema({
  groupId: {
    type: Schema.objectId,
    ref: "user",
    required: [true, "please provide an object id"],
  },
  creator: {
    type: Schema.objectId,
    ref: "user",
    required: [true, "please provide an object id"],
  },

  pendingGroupMembers: {
    type: [String],

    required: [true, "please provide an object id"],
  },
  createdAt: Date,
});
module.exports = model("pendingGroupRequest", pendingGroupRequest);
