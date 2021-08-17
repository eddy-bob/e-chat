const { Schema } = require("mongoose");
const Group = new Schema({
  creator: {
    type: Schema.objectId,
    ref: "user",
    required: [true, "please provide an object id"],
    groupName: {
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
    photo: { type: String, default: "mypic.jpg" },
    chat: { type: [String], sender: { type: String } },
    groupMembers: {
      type: [String],
     
    },
    membership:{}
    createdAt: Date,
  },
});
module.exports = model("chatGroup", Group);
