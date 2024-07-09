const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { makeAccessToken, makeRefreshToken } = require("../utils/makeToken");
const TokenModel = require("../services/tokenService");
const mongoose = require("mongoose");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const { v4: uuidv4 } = require("uuid");

exports.registerUser = async ({
  userEmail,
  userPassword,
  name,
  phoneNumber,
  photoUrl,
}) => {
  console.log("registerUser service called with:", {
    userEmail,
    userPassword,
    name,
    phoneNumber,
    photoUrl,
  });
  let user = await User.findOne({ userEmail });
  if (user) {
    console.error("registerUser error: User already exists");
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

  console.log("registerUser service successful, tokens:", {
    accessToken,
    refreshToken,
  });
  return { accessToken, refreshToken };
};

exports.loginUser = async ({ userEmail, userPassword }) => {
  console.log("loginUser service called with:", { userEmail, userPassword });
  let user = await User.findOne({ userEmail });
  if (!user) {
    console.error("loginUser error: 가입된 id가 아님");
    throw new Error("가입된 id가 아님");
  }

  const isMatch = await bcrypt.compare(userPassword, user.userPassword);
  if (!isMatch) {
    console.error("loginUser error: 비밀번호가 일치하지 않습니다.");
    throw new Error("비밀번호가 일치하지 않습니다.");
  }

  const resUser = {
    id: user._id,
    phoneNumber: user.phoneNumber,
    photoUrl: user.photoUrl,
    name: user.name,
    userEmail: user.userEmail,
  };

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

  console.log("loginUser service successful, tokens and user:", {
    accessToken,
    refreshToken,
    resUser,
  });
  return { accessToken, refreshToken, resUser };
};

exports.refreshAccessToken = async (refreshToken) => {
  console.log("refreshAccessToken service called with:", refreshToken);
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userToken = await TokenModel.findToken(decoded.user.id);

    if (!userToken || userToken.refreshToken !== refreshToken) {
      console.error("refreshAccessToken error: 유효하지 않은 리프레시 토큰");
      throw new Error("유효하지 않은 리프레시 토큰");
    }

    const payload = {
      user: {
        id: decoded.user.id,
      },
    };

    const newAccessToken = makeAccessToken(payload);
    console.log(
      "refreshAccessToken service successful, new accessToken:",
      newAccessToken
    );
    return { accessToken: newAccessToken };
  } catch (error) {
    console.error("refreshAccessToken service error:", error.message);
    throw new Error("유효하지 않은 리프레시 토큰");
  }
};

exports.getUsers = async () => {
  console.log("getUsers service called");
  let users = await User.find();
  if (!users || users.length === 0) {
    console.error("getUsers error: There are no users");
    throw new Error("There are no users");
  }

  const resUsers = users.map((user) => ({
    id: user._id,
    userName: user.name,
  }));

  console.log("getUsers service successful, users:", resUsers);
  return resUsers;
};

exports.getUserById = async (userId) => {
  console.log("getUserById service called with userId:", userId);
  try {
    const user = await User.findById(userId, "name _id");
    if (user) {
      console.log("getUserById service successful, user:", user);
      return { id: user._id, name: user.name };
    } else {
      console.error("getUserById service error: User not found");
      return null;
    }
  } catch (error) {
    console.error("getUserById service error:", error.message);
    throw new Error("Error fetching user");
  }
};

exports.getUsersImages = async (userIds) => {
  try {
    const users = await User.find({ _id: { $in: userIds } });
    if (users && users.length > 0) {
      const userImages = users.map((user) => ({
        id: user._id,
        photoUrl: user.photoUrl,
      }));
      return userImages;
    } else {
      console.error("No users found");
      return [];
    }
  } catch (err) {
    console.error("Error fetching users:", err);
    throw new Error("Error fetching users");
  }
};

exports.findUserNameById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user ? user.name : null;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    throw new Error("Error fetching user by id");
  }
};

exports.updateProfileImage = async (userId, imageUrl) => {
  console.log("updateProfileImage service called with:", { userId, imageUrl });
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("updateProfileImage error: Invalid user ID");
      throw new Error("Invalid user ID");
    }

    const user = await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId),
      { photoUrl: imageUrl },
      { new: true }
    );

    if (!user) {
      console.error("updateProfileImage error: User not found");
      return null;
    }

    console.log("updateProfileImage service successful, user:", user);
    return user.photoUrl;
  } catch (err) {
    console.error("Error in updateProfileImage:", err);
    throw new Error("Error updating profile image");
  }
};

exports.createImage = async (file) => {
  console.log("createImage service called with file:", file);
  const fileName = `${uuidv4()}-${file.originalname}`;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  try {
    const data = await s3.upload(params).promise();
    console.log("createImage service successful, imageUrl:", data.Location);
    return data.Location; // S3에 업로드된 이미지의 URL 반환
  } catch (err) {
    console.error("createImage service error:", err);
    throw new Error("Error uploading image to S3");
  }
};

exports.getCurrentUser = async (userId) => {
  console.log("getCurrentUser service called with userId:", userId);
  const user = await User.findById(userId).select("-userPassword"); // 비밀번호 제외
  if (!user) {
    console.error("getCurrentUser error: User not found");
    throw new Error("User not found");
  }
  console.log("getCurrentUser service successful, user:", user);
  return {
    id: user._id,
    userName: user.name,
    userEmail: user.userEmail,
    phoneNumber: user.phoneNumber,
    photoUrl: user.photoUrl,
  };
};

exports.logoutUser = async (userId) => {
  console.log("logoutUser service called with userId:", userId);
  await TokenModel.deleteToken(userId);
  console.log("logoutUser service successful");
};

exports.getUsersById = async (userId) => {
  console.log("getUsersById service called with userId:", userId);
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error("getUsersById error: Invalid user ID");
    throw new Error("Invalid user ID");
  }
  let user = await User.findById(userId);
  console.log("getUsersById service successful, user:", user);
  return user;
};

exports.getUsers = async () => {
  console.log("getUsers service called");
  let users = await User.find();
  if (!users || users.length === 0) {
    console.error("getUsers error: There are no users");
    throw new Error("There are no users");
  }

  const resUsers = users.map((user) => ({
    id: user._id,
    userName: user.name,
  }));

  console.log("getUsers service successful, users:", resUsers);
  return resUsers;
};
