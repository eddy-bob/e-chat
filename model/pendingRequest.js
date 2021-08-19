const { Schema, model } = require("mongoose");
const pendingRequest = new Schema({
  creator: {
    type: Schema.ObjectId,
    ref: "User",
    required: [true, "please provide an object id"],
  },

  pendingFriend: {
    type: String,
    unique: true,
    required: [true, "please provide a friend name"],
  },
  inviteToken: String,
  createdAt: Date,
});
module.exports = model("pendingRequest", pendingRequest);
