// src/services/userService.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { makeAccessToken, makeRefreshToken } = require("../utils/makeToken");
const TokenModel = require("../services/tokenService");

exports.registerUser = async ({
  userEmail,
  userPassword,
  name,
  phoneNumber,
  photoUrl,
}) => {
  let user = await User.findOne({ userEmail });
  if (user) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userPassword, salt);

  user = new User({
    userEmail,
    userPassword: hashedPassword,
    name,
    phoneNumber,
    photoUrl,
  });

  await user.save();

  const payload = {
    user: {
      id: user.id,
    },
  };

  const accessToken = makeAccessToken(payload);
  const refreshToken = makeRefreshToken(payload);

  await TokenModel.updateRefresh({
    user_id: user.id,
    refreshToken,
  });

  return { accessToken, refreshToken };
};

exports.loginUser = async ({ userEmail, userPassword }) => {
  let user = await User.findOne({ userEmail });
  if (!user) {
    throw new Error("가입된 id가 아님");
  }

  const isMatch = await bcrypt.compare(userPassword, user.userPassword);
  if (!isMatch) {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }

  const payload = {
    user: {
      id: user.id,
    },
  };

  const accessToken = makeAccessToken(payload);
  const refreshToken = makeRefreshToken(payload);

  await TokenModel.updateRefresh({
    user_id: user.id,
    refreshToken,
  });

  return { accessToken, refreshToken };
};

exports.refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const userToken = await TokenModel.findToken(decoded.user.id);

    if (!userToken || userToken.refreshToken !== refreshToken) {
      throw new Error("유효하지 않은 리프레시 토큰");
    }

    const payload = {
      user: {
        id: decoded.user.id,
      },
    };

    const newAccessToken = makeAccessToken(payload);
    return { accessToken: newAccessToken };
  } catch (error) {
    throw new Error("유효하지 않은 리프레시 토큰");
  }
};

exports.getUsers = async () => {
  let users = await User.find();
  if (!users || users.length === 0) {
    throw new Error("There are no users");
  }

  const resUsers = users.map((user) => ({
    id: user._id,
    userName: user.name,
  }));

  return resUsers;
};

const mongoose = require("mongoose");
const { User } = require("../models/User");

exports.updateProfileImage = async (userId, imageUrl) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    console.log(
      "Updating profile image for userId:",
      userId,
      "with imageUrl:",
      imageUrl
    );

    const user = await User.findByIdAndUpdate(
      mongoose.Types.ObjectId(userId),
      { photoUrl: imageUrl },
      { new: true }
    );

    if (!user) {
      console.error("User not found for userId:", userId);
      return null;
    }

    console.log("Updated user:", user);
    return user.photoUrl;
  } catch (err) {
    console.error("Error in updateProfileImage:", err);
    throw new Error("Error updating profile image");
  }
};

exports.getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-userPassword"); // 비밀번호 제외
  if (!user) {
    throw new Error("User not found");
  }
  return {
    id: user._id,
    userName: user.name,
    userEmail: user.userEmail,
    phoneNumber: user.phoneNumber,
    photoUrl: user.photoUrl,
  };
};

exports.logoutUser = async (userId) => {
  await TokenModel.deleteToken(userId);
};
