require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const moment = require("moment");
const asyncHandler = require("express-async-handler");

const Admin = require("../models/admin");
const sendEmail = require("../utils/email-service");
const ErrorObject = require("../utils/error");

const { EXPIRES_IN, SECRET } = process.env;

const createUser = asyncHandler(async (req, res, next) => {
  const { email, password, accountName, accountNumber, accountBank } = req.body;
  

  // TODO: make a service
  const emailAlreadyExists = await Admin.findOne({email});
  if (emailAlreadyExists) {
    return next(new ErrorObject("A user with this email already exists", 400));
  }

  const user = await Admin.create({
    email,
    password,
    accountName,
    accountNumber,
    accountBank,
  });

  // TODO: make a service
  const token = jwt.sign({ userId: user._id }, SECRET, {
    expiresIn: EXPIRES_IN,
  });


  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30;
  
  try {
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + oneDay),
      httpOnly: true,
    });
  } catch (error) {
    console.error("Error setting cookie:", error);
    // Handle the error appropriately (e.g., send an error response)
  }


  // Construct user response object
  const userResponse = {
    status: "success",
    userId: user._id,
    email: user.email,
    token,
  };

  return res.status(201).json({ user: userResponse });
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new ErrorObject("Please provide email and password", 400));
  }

  const user = await Admin.findOne(email).select("+password");
  if (!user) {
    return next(new ErrorObject("Invalid Credentials", 400));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    next(new ErrorObject("Invalid Credentials", 400));
  }

  // TODO: make a service
  const token = jwt.sign({ userId: user._id }, SECRET, {
    expiresIn: EXPIRES_IN,
  });

  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30;
  
  try {
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + oneDay),
      httpOnly: true,
    });
  } catch (error) {
    console.error("Error setting cookie:", error);
    // Handle the error appropriately (e.g., send an error response)
  }

  // Construct user response object
  const userResponse = {
    status: "success",
    userId: user._id,
    email: user.email,
    token,
  };

  return res.status(200).json({ user: userResponse });
});

// Get all users
const getAllusers = asyncHandler(async (req, res, next) => {
  // TODO: allow only superuser on this route

  const users = await Admin.find().select("-password");
  res.status(200).json(users);
});

// Get a single user
const getUserById = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  cosole.log(userId)
  const user = req.user;
  console.log(user)

  if (user._id != userId) {
    return next(
      new ErrorObject("You are not allowed to access these details", 401)
    );
  }

  const userDetails = await Admin.findById(userId);
  res.status(200).json({ user: userDetails });
});

// Update an user
const updateUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const { email } = req.body;

  const loggedInuserId = req.user.userId;
  if (loggedInuserId !== userId) {
    next(new ErrorObject("You are not allowed to access this user", 401));
  }
  let user = await Admin.findById(userId);

  if (!user) {
    next(new ErrorObject("User not Found", 404));
  }

  user.username = username || user.username;
  user.email = email || user.email;

  user = await user.save();

  const updatedUser = { ...user.toJSON() };
  delete updatedUser.password;

  res.status(200).json({ user: updatedUser });
});

// Delete an user
const deleteUser = async (req, res, next) => {
  const { userId } = req.params;

  const loggedInUserId = req.user.userId;
  if (loggedInUserId !== userId) {
    return next(
      new ErrorObject("You are not allowed to access this user", 401)
    );
  }

  const user = await Admin.findByIdAndDelete(userId);
  if (!user) {
    return next(new ErrorObject("User not Found", 404));
  }

  res.status(204).json({ message: "user deleted succesfully" });
};

const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const userID = req.params.userID;
  if (!currentPassword || !newPassword) {
    return next(new ErrorObject("provide both passwords", 400));
  }

  if (currentPassword == newPassword) {
    return res
      .status(400)
      .json({ message: "make a change of password please" });
  }

  const loggedInUserId = req.user.userID;
  if (loggedInUserId !== userID) {
    return next(
      new ErrorObject("You are not allowed to access this route", 401)
    );
  }

  const user = await User.findById(userID).select("+password");
  if (!user) {
    return next(new ErrorObject("User not Found", 404));
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    return next(new ErrorObject("Invalid Credentials", 400));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
};

const forgotPassword = async (req, res, next) => {
  const { userId } = req.params;
  const loggedInUserId = req.user.userId;
  if (loggedInUserId !== userId) {
    return next(
      new ErrorObject("You are not allowed to access this route", 401)
    );
  }

  const user = await Admin.findById(userId);
  if (!user) {
    return next(new ErrorObject("user not found", 404));
  }

  email = user.email;

  const otp = randomstring.generate({
    length: 6,
    charset: "numeric",
  });

  const expirationTime = moment().add(10, "minute").toDate();

  user.resetPasswordOTP = otp;
  user.resetPasswordExpires = expirationTime;
  await user.save();

  await sendEmail(
    email,
    "Password Reset OTP",
    `Your OTP for resetting your password is: ${otp}. It will expire in 10 minutes.`,
    next
  );

  res.status(200).json({ message: "OTP sent to your email" });
};

const resetPassword = async (req, res, next) => {
  const { email, token, newPassword } = req.body;

  const user = await Admin.findOne({ email });
  if (!user) {
    return next(new ErrorObject("user not found", 404));
  }
  if (
    user.resetPasswordOTP !== token ||
    new Date() > user.resetPasswordExpires
  ) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }
  user.password = newPassword;
  user.resetPasswordOTP = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
};

module.exports = {
  createUser,
  getAllusers,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  loginUser,
};
