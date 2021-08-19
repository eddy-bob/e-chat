const { Schema, model } = require("mongoose");
const Group = new Schema(
  {
    creator: {
      type: Schema.ObjectId,
      ref: "user",
      required: [true, "please provide an object id"],
    },
    groupName: {
      type: String,
      unique: [true, "a group already exists with that name"],
      required: [true, "please add a group name "],

      trim: true,
    },
    description: {
      type: String,
      required: [true, "please include a group description"],
      max: [30, "description cant be more than 30 words"],
      trim: true,
    },
    photo: { type: String, default: "mypic.jpg" },
    chat: { type: [String] },
    groupMembers: {
      type: [String],
    },
    admin: { type: [String] },
    pendingMembers: { type: [String] },

    createdAt: Date,
  },
  { timestamps: true }
);

module.exports = model("chatGroup", Group);
