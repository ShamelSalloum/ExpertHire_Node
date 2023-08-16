import ErrorHandler from "../utils/errorhander";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import User from "../models/userModel";
import sendToken from "../utils/jwtToken";
import sendEmail from "../utils/sendEmail";
import validator from "validator";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';

export let blacklist = [];

const getCurrentDirectory = (importMetaUrl) => {
  const __filename = fileURLToPath(importMetaUrl);
  return path.dirname(__filename);
};

export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    sex,
    username,
    password,
    birthdate,
  } = req.body;

  const user = await User.create({
    first_name,
    last_name,
    email,
    phone,
    sex,
    username,
    password,
    birthdate,
  });

  sendToken(user, 200, res);
});
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 201));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 201));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 201));
  }

  sendToken(user, 200, res);
});
export const logout = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.body;
  blacklist.push(token)

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 201));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const currentDir = getCurrentDirectory(import.meta.url);
  const templatePath = path.join(currentDir,'..', 'html', 'email.html');
  const emailTemplate = fs.readFileSync(templatePath, 'utf-8');
  const emailHtml = emailTemplate.replace('{{ resetToken }}', resetToken);
  console.log('Email HTML:', emailHtml);

  try {
    await sendEmail({
      email: user.email,
      subject: `Password Recovery`,
      html: emailHtml, // Make sure this property is used for HTML content
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 400));
  }
});
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const enteredToken = req.body.token; // The numeric token entered by the user
  const user = await User.findOne({
    resetPasswordToken: enteredToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Verification Code is invalid or has expired",
        201
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 201));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    unique: true,
    email: req.body.email,
    phone: req.body.phone,
  };
  if (req.body.email && !validator.isEmail(req.body.email)) {
    return res
      .status(201)
      .json({ success: false, message: "Invalid email address" });
  }
  const user  = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

export const getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});
export const getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});
export const updateUserRole = catchAsyncErrors(async (req, res, next) => {

  const newUserData = {
    role: "admin",
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
  });

  res.status(200).json({
    success: true,
  });

});
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
export const getOtherUsersDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    user,
  });
});
export const banUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });
  let banUser;
  if (user.ban === true) {
    banUser = {
      ban: false
    };
  } else {
    banUser = {
      ban: true
    }
  }
  await User.findByIdAndUpdate(req.params.id, banUser, {
    new: true,
  });
  res.status(200).json({
    success: true,
    message: "this user panned successfully"
  });
});
export const getUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users
  });
});
export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user_id = req.params.id

  const user = await User.findById(user_id)
  res.status(200).json({
    success: true,
    user
  });
});
export const getBannedUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ ban: true });
  res.status(200).json({
    success: true,
    users,
  });
});
export const searchUser = catchAsyncErrors(async (req, res, next) => {
  const query = req.body.query;

  const distinctUserIds = await User.distinct('_id', {
    $or: [
      { first_name: { $regex: query, $options: 'i' } },
      { last_name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { username: { $regex: query, $options: 'i' } },
    ],
  });

  const users = await User.find({ _id: { $in: distinctUserIds } });

  res.status(200).json({ users });
});





