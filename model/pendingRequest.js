const { Schema } = require("mongoose");
const pendingFriendRequest = new Schema({
  user: {
    type: Schema.objectId,
    ref: "user",
    required: [true, "please provide an object id"],
  },
  pendingFriend: {
    type: Schema.objectId,
    ref: "user",
    required: [true, "please provide an object id"],
  },

  createdAt: Date,
});
module.exports = model("pendingFriendRequest", pendingFriendRequest);
