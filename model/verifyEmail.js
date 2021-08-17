const { Schema, model } = require("mongoose");
const crypto = require("crypto");
const verifyEmail = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: [true, "please provide an object id"],
  },
  verificationToken: { type: String, select: false },
  expires: { type: Date, select: false },
  timestamps: Date,
});
verifyEmail.methods.getToken = async function () {
  var token = crypto.randomBytes(20).toString("hex");
  hashEmailToken = crypto.createHash("sha256").update(token).digest("hex");
  this.verificationToken = hashEmailToken;
  this.expires = Date.now() + 10 * 60 * 1000;
  return hashEmailToken;
};
module.exports = model("verifyEmailSchema", verifyEmail);
