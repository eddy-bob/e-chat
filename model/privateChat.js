const { Schema } = require("mongoose");
const chatGroup = new Schema({
  creator: {
    type: Schema.objectId,
    ref: "user",
    required: [true, "please provide an object id"],
    name: {
      type: String,
      required: [true, "please add a  group name"],
      trim: true,
      unique: [true, "a group already exists with that name"],
    },
    description: {
      type: String,
      required: [true, "please include a group description"],
      max: [30, "description cant be more than 30 words"],
      trim: true,
    },
    groupMembers: [String],
    createdAt: Date,
  },
});
module.exports = model("chatGroup", chatGroup);
