const bcrypt = require("bcryptjs");
const { User } = require("../models/User");
const { makeAccessToken, makeRefreshToken } = require("../utils/makeToken");
const TokenModel = require("../services/tokenService");

exports.registerUser = async ({ userEmail, userPassword, name, phoneNumber, photoUrl }) => {
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
  const refreshToken = makeRefreshToken();

  await TokenModel.updateRefresh({
    _id: user.id,
    refreshToken
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
  const refreshToken = makeRefreshToken();

  await TokenModel.updateRefresh({
    _id: user.id,
    refreshToken
  });

  return { accessToken, refreshToken };
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
