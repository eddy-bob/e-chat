const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const user = new Schema(
  {
    name: {
      type: String,
      required: [true, "please include a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "please include an email"],
      unique: [true, "a user already exists with this email"],
      match: [
        // eslint-disable-next-line no-useless-escape
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "please add a valid email",
      ],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: {
      type: String,
      select: false,
      required: [true, "please include a password"],
    },
    phone: {
      type: Number,
      required: [true, "please incude a phone number"],
      unique: true,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastSeen: {
      type: Date,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

user.pre("save", async function (next) {
  const saltRounds = 10;
  const salt = await bcrypt.hash(this.password, saltRounds);
  this.password = salt;
  next();
});

user.methods.comparePassword = async function (password) {
  console.log(password + "and" + this.password);
  return await bcrypt.compareSync(password, this.password);
};
user.methods.genResetPasswordToken = async function () {
  var token = crypto.randomBytes(20).toString("hex");
  hashToken = crypto.createHash("sha256").update(token).digest("hex");
  this.ResetPasswordToken = hashToken;
  this.resetPasswordExpire = Date.now() + 12 * 60 * 1000;
  return hashToken;
};
user.methods.getToken = async function () {
  var token = await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: Date.now() + 10 * 60 * 60 * 1000,
  });
  return token;
};
module.exports = model("userModel", user);
