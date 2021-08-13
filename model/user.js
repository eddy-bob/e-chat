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
      unique: [true, "a user already exists with this email"],
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
      trim: true,
      minlength: 8,
      match: [
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,}$",
        "your password must containMinimum eight characters, at least one uppercase letter, one lowercase letter and one number: ",
      ],
      select: false,
    },
    phone: {
      type: Number,
      required: [true, "please incude a phone number"],
      unique: [true, "a user already exists with that phone number"],
      max: 15,
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
  if (!this.isModified(password)) {
    next();
  }
  var salt = bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt);
});

user.methods.comparePassword = async function (password) {
  return await bycrypt.compare(this.password, password);
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
    expiresIn: process.env.JWT_EXPIRES,
  });
  return token;
};
module.exports = model("userModel", user);
