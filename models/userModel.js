import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "Please Enter Your Firsty Name"],
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [3, "Name should have more than 3 characters"],
    },
    last_name: {
      type: String,
      required: [true, "Please Enter Your last Name"],
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [3, "Name should have more than 3 characters"],
    },
    username: {
      type: String,
      required: [true, "Please Enter a username"],
      maxLength: [60, "Name cannot exceed 30 characters"],
      minLength: [3, "Name should have more than 3 characters"],
      unique: true,
    },
    sex: {
      type: String,
      required: [true, "Please Enter your sex"]
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    phone: {
      type: Number,
      required: [true, "Please Enter Your Mobile"],
      unique: true,
      minLength: [10, "Mobile should be greater than 10 characters"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLength: [8, "Password should be greater than 8 characters"],
      select: false,
    },
    birthdate: {
      type: String,
      required: [true, "Please Enter Your birthdate"],
    },
    ban: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = Math.floor(1000000000 + Math.random() * 9000000000); // Generates a 10-digit numeric token
  this.resetPasswordToken = resetToken.toString();
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // Token expiration time: 15 minutes
  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;


// userSchema.methods.getResetPasswordToken = function () {
//   const resetToken = crypto.randomBytes(20).toString("hex");
//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");
//   this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // Token expiration time: 15 minutes
//   return resetToken;
// };